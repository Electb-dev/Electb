import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import { defineConfig, globalIgnores } from "eslint/config";
import { fixupConfigRules, fixupPluginRules } from "@eslint/compat";
import eslintConfigPrettier from "eslint-config-prettier";
import prettier from "eslint-plugin-prettier";
import react from "eslint-plugin-react";
import unusedImports from "eslint-plugin-unused-imports";
import _import from "eslint-plugin-import";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import jsxA11Y from "eslint-plugin-jsx-a11y";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import js from "@eslint/js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

export default defineConfig([
  globalIgnores([
    ".now/*",
    "**/*.css",
    "**/.changeset",
    "**/dist",
    "esm/*",
    "public/*",
    "tests/*",
    "scripts/*",
    "**/*.config.js",
    "**/*.config.mjs",
    "**/.DS_Store",
    "**/node_modules",
    "**/coverage",
    "**/.next",
    "**/build",
    "!**/.commitlintrc.cjs",
    "!**/.lintstagedrc.cjs",
    "!**/jest.config.js",
    "!**/plopfile.js",
    "!**/react-shim.js",
    "!**/tsup.config.ts",
  ]),
  {
    // 指定要应用这些规则的文件类型
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],

    languageOptions: {
      globals: {
        ...Object.fromEntries(Object.entries(globals.browser).map(([key]) => [key, "off"])),
        ...globals.node,
      },

      parser: tsParser, // 使用 TypeScript 的解析器
      ecmaVersion: 2024, // 支持 ECMAScript 2024 标准
      sourceType: "module", // 使用 ES 模块语法

      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },

    settings: {
      react: {
        version: "detect",
      },
    },

    extends: fixupConfigRules(compat.extends(
      "plugin:react/recommended",
      "plugin:prettier/recommended",
      "plugin:react-hooks/recommended",
      "plugin:jsx-a11y/recommended",
      "plugin:@next/next/recommended",
    )),

    plugins: {
      react: fixupPluginRules(react),// 启用 React 插件以支持 JSX
      "unused-imports": unusedImports,
      import: fixupPluginRules(_import),
      "jsx-a11y": fixupPluginRules(jsxA11Y), // 启用 JSX 可访问性插件以增强无障碍检查
      "@typescript-eslint": typescriptEslint, // 启用 TypeScript 插件以增强 TypeScript 检查
      prettier: fixupPluginRules(prettier),
    },

    rules: {
      // 合并 Prettier 的规则以禁用所有与 Prettier 冲突的 ESLint 规则
      ...eslintConfigPrettier.rules,

      "no-console": "warn",
      "react/prop-types": "off",
      "react/jsx-uses-react": "off",
      "react/react-in-jsx-scope": "off",
      "react-hooks/exhaustive-deps": "off",
      "jsx-a11y/click-events-have-key-events": "warn",
      "jsx-a11y/interactive-supports-focus": "warn",
      "prettier/prettier": "warn",
      "no-unused-vars": "off",
      "unused-imports/no-unused-vars": "off",
      "unused-imports/no-unused-imports": "warn",

      "@typescript-eslint/no-unused-vars": ["warn", {
        args: "after-used",
        ignoreRestSiblings: false,
        argsIgnorePattern: "^_.*?$",
      }],

      "import/order": ["warn", {
        groups: [
          "type",
          "builtin",
          "object",
          "external",
          "internal",
          "parent",
          "sibling",
          "index",
        ],

        pathGroups: [{
          pattern: "~/**",
          group: "external",
          position: "after",
        }],

        "newlines-between": "always",
      }],

      "react/self-closing-comp": "warn",

      "react/jsx-sort-props": ["warn", {
        callbacksLast: true,
        shorthandFirst: true,
        noSortAlphabetically: false,
        reservedFirst: true,
      }],

      "padding-line-between-statements": ["warn", {
        blankLine: "always",
        prev: "*",
        next: "return",
      }, {
        blankLine: "always",
        prev: ["const", "let", "var"],
        next: "*",
      }, {
        blankLine: "any",
        prev: ["const", "let", "var"],
        next: ["const", "let", "var"],
      }],
    },
  },
]);
