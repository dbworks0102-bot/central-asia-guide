# 自動公開ログ

3日に1本のローテーションで src/data/articles.js のdraft記事をpublishedへ自動昇格した記録です。
対象順序・除外slugは scripts/auto-publish.mjs の SKIP_SLUGS を参照。

## 2026-07-27 22:43
⚠️ 「tashkent-khazrati-imam-complex-highlights」の公開を試みましたが lint が失敗したため中止し、articles.js の変更を破棄しました。
```n
> central-asia-guide@1.0.0 lint
> eslint .


C:\Users\vanva\Clode Code\central-asia-guide\scripts\auto-publish.mjs
  41:16  error  'process' is not defined  no-undef
  41:69  error  'process' is not defined  no-undef
  46:5   error  'console' is not defined  no-undef
  49:5   error  'console' is not defined  no-undef

✖ 4 problems (4 errors, 0 warnings)


```

## 2026-07-27 22:44
「tashkent-khazrati-imam-complex-highlights」を公開しました（lint/test/build通過 → commit d605a47 → push済み。Vercelが自動デプロイします）。
