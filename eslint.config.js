// ESLint フラット設定（ESLint v9+）。
// 方針：軽量に保つ。@eslint/js の recommended のみをベースにし、
// 環境ごとにグローバル（ブラウザ / Node / テスト）を正しく認識させる。
import js from "@eslint/js";
import globals from "globals";

export default [
  // ビルド成果物・依存・テスト出力は対象外
  {
    ignores: ["dist/**", "node_modules/**", "test-results/**", "playwright-report/**"],
  },

  // ベースの推奨ルール（全 .js 共通）
  js.configs.recommended,

  // 共通のパーサ設定
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
  },

  // アプリ本体（ブラウザ環境）
  {
    files: ["src/**/*.js"],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },

  // ビルドスクリプト・各種設定ファイル（Node 環境）
  {
    files: ["scripts/**/*.js", "*.config.js"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },

  // ユニットテスト（Vitest、jsdom 環境 + Node）
  {
    files: ["tests/unit/**/*.js"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },

  // E2E テスト（Playwright、Node 環境 + page.evaluate 内はブラウザ環境）
  {
    files: ["tests/e2e/**/*.js"],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
  },
];
