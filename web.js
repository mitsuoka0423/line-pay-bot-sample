// おまじない
"use strict";

// ########################################
//               初期設定など
// ########################################

// .envファイルを読み込みます
require('dotenv').config();

// パッケージを使用します
const { v4: uuidv4 } = require('uuid');
const LinePay = require('line-pay-v3');
const line = require('@line/bot-sdk');
const express = require("express");
const app = express();

// 注文のデータを一時的に保管します
const orderData = {};

// line-pay-v3を使用する準備
const pay = new LinePay({
    channelId: process.env.LINE_PAY_CHANNEL_ID,
    channelSecret: process.env.LINE_PAY_CHANNEL_SECRET,
    uri: process.env.ENV === 'production' ? 'https://api-pay.line.me' : 'https://sandbox-api-pay.line.me'
});

// Messaging APIで利用するクレデンシャル（秘匿情報）です。
const config = {
    channelSecret: process.env.LINE_BOT_CHANNEL_SECRET,
    channelAccessToken: process.env.LINE_BOT_ACCESS_TOKEN
};

// LINE SDKを初期化します
const client = new line.Client(config);

// ローカル（自分のPC）でサーバーを公開するときのポート番号です
app.listen(process.env.PORT || 5000, () => {
    console.log(`server is listening... ${process.env.NGROK_URL}`);
});

// publicフォルダのファイルを公開する
app.use(express.static(__dirname + "/public"));

// LINEサーバーからWebhookがあると「サーバー部分」から以下の "handleEvent" という関数が呼び出されます
async function handleEvent(event) {
    // 受信したWebhookが「テキストメッセージ以外」であればnullを返すことで無視します
    if (event.type !== 'message' || event.message.type !== 'text') {
        return Promise.resolve(null);
    }

    if (event.message.text === 'チョコレート') {
        console.log('決済予約処理を実行します。');

        // 商品名や値段を設定する場合はここを変更します。
        const order = {
            amount: 100, // packages[].amountの合計金額を記入する
            currency: 'JPY',
            orderId: uuidv4(),
            packages: [
                {
                    id: 'Item001',
                    amount: 100, // products[].priceの合計金額を記入する
                    name: '買い物かご',
                    products: [
                        {
                            name: 'チョコレート', // 商品名
                            imageUrl: 'https://2.bp.blogspot.com/-zEtBQS9hTfI/UZRBlbbtP8I/AAAAAAAASqE/vbK1D7YCNyU/s800/valentinesday_itachoco2.png', // 商品画像
                            quantity: 1, // 購入数
                            price: 100 // 商品金額
                        }
                    ]
                }
            ],
            redirectUrls: {
                confirmUrl: `${process.env.NGROK_URL}/pay/confirm`,
            }
        };
        console.log('以下のオプションで決済予約を行います。');
        console.log('order', order);

        try {
            // LINE Pay APIを使って、決済予約を行う。
            const response = await pay.request(order);
            console.log('response', response);

            // 決済確認処理に必要な情報を保存しておく。
            order.userId = event.source.userId;
            orderData[order.orderId] = order;

            const message = {
                type: "template",
                altText: `チョコレートを購入するには下記のボタンで決済に進んでください`,
                template: {
                    type: "buttons",
                    text: `チョコレートを購入するには下記のボタンで決済に進んでください`,
                    actions: [
                        { type: "uri", label: "LINE Payで決済", uri: response.info.paymentUrl.web },
                    ]
                }
            }
            await client.replyMessage(event.replyToken, message);

            console.log('決済予約が完了しました。');

            return;
        } catch (e) {
            console.log('決済予約でエラーが発生しました。');
            console.log(e);
        };
    }

    // 「テキストメッセージ」であれば、受信したテキストをそのまま返事します
    return client.replyMessage(event.replyToken, {
        type: 'text',
        text: event.message.text // ← ここに入れた言葉が実際に返信されます
    });
}

// HTTP POSTによって '/webhook' のパスにアクセスがあったら、POSTされた内容に応じて様々な処理をします
app.post('/webhook', line.middleware(config), (req, res) => {
    // Webhookの中身を確認用にターミナルに表示します
    console.log(req.body.events);

    // 空っぽの場合、検証ボタンをクリックしたときに飛んできた"接続確認"用
    // 削除しても問題ありません
    if (req.body.events.length == 0) {
        res.send('Hello LINE BOT! (HTTP POST)'); // LINEサーバーに返答します
        console.log('検証イベントを受信しました！'); // ターミナルに表示します
        return; // これより下は実行されません
    }

    // あらかじめ宣言しておいた "handleEvent" 関数にWebhookの中身を渡して処理してもらい、
    // 関数から戻ってきたデータをそのままLINEサーバーに「レスポンス」として返します
    Promise.all(req.body.events.map(handleEvent)).then((result) => res.json(result));
});

// 決済確認処理
app.use('/pay/confirm', async (req, res) => {
    console.log('/pay/confirmの処理を実行します。');

    // 決済予約時に保存した情報を取り出す。
    const orderId = req.query.orderId;
    if (!orderId) {
        throw new Error('Order ID is not found');
    }
    const order = orderData[req.query.orderId];
    if (!order) {
        throw new Error('Order is not found');
    }

    // 決済確認処理に必要なオプションを用意する。
    const option = {
        amount: order.amount,
        currency: order.currency
    }
    console.log('以下のオプションで決済確認を行います。');
    console.log(option);

    try {
        // LINE Pay APIを使って、決済確認を行う。
        await pay.confirm(option, req.query.transactionId)

        await client.pushMessage(order.userId, {
            type: 'text',
            text: '決済が完了しました。'
        });

        res.send('決済が完了しました。');

        console.log('決済が完了しました。');
    } catch (e) {
        console.log('決済確認処理でエラーが発生しました。');
        console.log(e);
    };
});
