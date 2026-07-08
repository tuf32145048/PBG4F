# Python Beginner Guide

Python初学者が、短い問題を繰り返し解きながら「問題文をコードへ変換する力」を身につけるための静的Web教材です。

## 開発環境

- Node.js 22.12以降
- npm 11以降

```powershell
cd web
npm install
npm run dev
```

本番相当の確認:

```powershell
npm run validate
npm run test
npm run lint
npm run build
npm run preview
```

## 構成

- `web/content/`: 教材、問題、用語、Tipsの原稿データ
- `web/src/`: Reactアプリケーション
- `web/scripts/`: コンテンツ検証などの開発用スクリプト
- `web/tests/`: 単体・統合テスト

教材本文はMarkdown、構造化情報はJSONで管理します。JSONの形式とデータ間の参照は、ビルド前にZodで検証されます。

## 配布

`npm run build` で生成される `web/dist/` を静的ホスティングへ配置してください。ルーティングにはURLハッシュを使用するため、サーバー側のリライト設定は不要です。
