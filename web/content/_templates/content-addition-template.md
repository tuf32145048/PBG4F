# 教材追加テンプレート

このファイルは、1章分の教材・問題・用語・Tipsを追加するときの作業用テンプレートです。先に `content-expansion-workflow.md` で作業範囲を決めてから使います。

## 1章分の標準単位

- 教材: 1章
- 問題: 8から12問
- 用語: 新概念に必要な分だけ追加
- Tips: 本文に混ぜると流れが重くなる補足だけ追加
- 検証: 少なくとも `npm run validate`

章が大きくなりすぎる場合は、章を分けます。1章は「読んだ直後に練習へ進める範囲」に留めます。

## Lesson Brief

最初にこのメモを埋めてからJSONやMarkdownを書き始めます。

```markdown
## Lesson Brief

- slug:
- order:
- title:
- learner before:
- learner after:
- prerequisite lesson ids:
- term plan path:
- term plan approved:
- main terms:
- optional tips:
- problem count:
- level 1 problems:
- level 2 problems:
- level 3 problems:
- avoid in this lesson:
- needs question file:
```

`learner before` と `learner after` が曖昧な場合は、本文を書き始めずに `notes/questions/YYYY-MM-DD-topic.md` へ質問を切り出します。

## 追加順

1. Lesson Briefを埋める。
2. `term-plan-template.md` を使い、`notes/term-plans/YYYY-MM-DD-<lesson-slug>.md` に用語候補をまとめる。
3. 用語の対応についてユーザー確認を受ける。
4. `web/content/lessons/<slug>.json` を作る。
5. `web/content/lessons/<slug>.md` を作る。
6. `web/content/problems/<slug>.json` を作る。
7. `web/content/terms/terms.json` に不足用語を追加する。
8. `web/content/tips/tips.json` に補足を追加する。
9. `npm run validate` を `web/` で実行する。
10. UI・スキーマ・挙動を変えた場合だけ `test`、`lint`、`build` まで実行する。
11. `notes/TODO.md` に作業記録と残課題を追記する。

IDは小文字のkebab-caseにします。逆参照はJSONへ重複保存しません。`ContentCatalog` 生成時に算出されます。

## Lesson Metadata

```json
{
  "id": "lesson-id",
  "slug": "lesson-id",
  "order": 3,
  "title": "教材タイトル",
  "summary": "この章で何ができるようになるかを一文で書きます。",
  "objectives": [
    "学習後に観察できる行動を書く"
  ],
  "prerequisiteIds": ["previous-lesson-id"],
  "termIds": ["term-id"],
  "tipIds": ["tip-id"]
}
```

## Lesson Markdown

````markdown
# 教材タイトル

この章で解けるようになる実用的な問題から始めます。

## 最初の概念

一度に説明する概念を絞ります。コード例は短くします。

```python
print("example")
```

## 考え方

入力、処理、出力をどう分けて読むかを説明します。

## 練習へ進む前に

問題を開く前に確認してほしい観点を書きます。
````

通常の説明文では、`autoLink` が有効な用語の表示語だけに自動リンクが付きます。意図が曖昧になる場合だけ `[print()](term:print)` のように明示リンクを使います。コードブロック、インラインコード、既存リンクは自動リンク対象外です。

## Problem Object

各問題は、読む、分解する、書く、見直す、の流れが見えるようにします。

```json
{
  "id": "problem-id",
  "slug": "problem-id",
  "lessonId": "lesson-id",
  "title": "問題タイトル",
  "level": 1,
  "conceptIds": ["term-id"],
  "statement": "何を作るかを短く正確に書きます。",
  "inputFormat": "入力の形式を書きます。",
  "outputFormat": "出力の形式を書きます。",
  "samples": [
    {
      "input": "sample input\\n",
      "output": "sample output\\n",
      "explanation": "必要ならサンプルの読み方を書きます。"
    }
  ],
  "hints": [
    "最初は考え方だけ示します。",
    "次に具体的な実装へ近づけます。"
  ],
  "solution": {
    "code": "print(\"sample\")",
    "explanation": "なぜこのコードで解けるかを説明します。"
  },
  "explanationTrace": [
    {
      "step": "問題文を読む",
      "detail": "入力と出力の対応を確認します。"
    }
  ],
  "commonMistakes": [
    "よくあるミスを具体的に書きます。"
  ],
  "reviewChecklist": [
    {
      "id": "check-id",
      "label": "最後に確認することを行動として書きます。"
    }
  ]
}
```

## Problem Ladder

1章の問題は、難度を急に上げずに並べます。

- Level 1: 既習概念の確認、1から2ステップで解ける問題。
- Level 2: 入力、変換、条件、反復などを組み合わせる問題。
- Level 3: 問題文を分解し、複数の処理を順番に実装する問題。

目安として、Level 1を3から4問、Level 2を4から6問、Level 3を1から2問にします。

## Term Object

```json
{
  "id": "term-id",
  "label": "表示名",
  "aliases": ["別名"],
  "category": "programming-concept",
  "descriptionTargetId": "term-id",
  "autoLink": true,
  "short": "初見で読む短い説明。",
  "detail": "理解を深める説明。",
  "later": "今は深入りしないが、後で役立つ背景。",
  "relatedTermIds": ["other-term-id"]
}
```

`short` は初学者がその場で読む前提にします。実装詳細、メモリ、型システム、数学的背景などは `later` へ逃がします。

カテゴリは `general-concept`、`programming-concept`、`python-specific` の3つだけを使います。

## Tip Object

```json
{
  "id": "tip-id",
  "title": "補足タイトル",
  "body": "短い補足説明。",
  "lessonIds": ["lesson-id"],
  "termIds": ["term-id"]
}
```

## Content Rules

- 1問に詰め込む新概念は1つ、多くても数個にします。
- 1問は5から10分で解ける粒度を基本にします。
- 初学者向けコードでは、未説明の省略記法や技巧的な書き方を避けます。
- 学習者向け本文では、ユーザーが方針を変えない限り外部ジャッジ・コンテストサイト名を出しません。
- 用語が複数章で繰り返されるなら、本文で説明し続けるより用語へ切り出します。
- スキーマ、描画、用語リンク、進捗保存、操作挙動を変えた場合はテストを追加・更新します。
