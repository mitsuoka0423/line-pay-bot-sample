# LINE Pay Bot Sample

LINE Bot + LINE Pay API v3のサンプルアプリです。

## 動作イメージ

<a href="https://gyazo.com/5c053b684ff6a6fe2fbfab799a8d2e65"><img src="https://i.gyazo.com/5c053b684ff6a6fe2fbfab799a8d2e65.gif" alt="Image from Gyazo" width="400"/></a>

## インストール

```bash
npm i
```

## 環境変数

`.env.sample`をコピーして`.env`を作成し、以下の内容を入力する。

| 項目 | 内容 | 備考 |
| -- | -- | -- |
| LINE_PAY_CHANNEL_ID | LINE PayのチャネルID | LINE Pay管理画面から取得可能 |
| LINE_PAY_CHANNEL_SECRET | LINE Payのチャネルシークレット | LINE Pay管理画面から取得可能 |
| LINE_BOT_CHANNEL_SECRET | LINE BotのチャネルID | LINE Developerコンソールから取得可能 |
| LINE_BOT_ACCESS_TOKEN | LINE Botのアクセストークン | LINE Developerコンソールから取得可能 |
| NGROK_URL | https://xxxxxxxxxxxxx.ngrok.io | ngrokのトンネリングURL |

## 実行

```bash
npx ngrok http 5000
```

ngrokのURLが発行されるので、`.env`の`NGROK_URL`を更新する。

```bash
node web.js

server is listening... https://xxxxxxxxxxx.ngrok.io
```

## Messaging API Webhook URLの設定

[LINE Developerコンソール](https://developers.line.biz/ja/)から、対象のLINE BotのWebhook URLを更新する。

[![Image from Gyazo](https://i.gyazo.com/470de4ab810d1d3da0b84fc5ad1c6b46.png)](https://gyazo.com/470de4ab810d1d3da0b84fc5ad1c6b46)

> 末尾に`/webhook`が必要です。

## 動作確認

LINE Botに`チョコレート`と送信してください。
