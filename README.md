# LINE Pay Bot Sample

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

```bash
node web.js

server is listening... https://xxxxxxxxxxx.ngrok.io
```

サーバー起動後、http://xxxxxxxxxxx.ngrok.io/ からアクセスできる。
