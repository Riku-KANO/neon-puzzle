import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import unusedImports from "eslint-plugin-unused-imports";
import eslintConfigPrettier from "eslint-config-prettier";
import storybook from "eslint-plugin-storybook";

export default tseslint.config(
  {
    ignores: [
      "dist",
      "coverage",
      "public",
      "vitest.shims.d.ts",
      "storybook-static",
      "pkg",
      "**/*.js",
      ".storybook/**/*",
    ],
  },
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
    ],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      react: react,
      "unused-imports": unusedImports,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],

      // React Strict Rules
      ...react.configs.recommended.rules,
      ...react.configs["jsx-runtime"].rules,
      "react/jsx-boolean-value": ["error", "always"], // Example strict rule
      "react/self-closing-comp": "error",

      // TypeScript Strict & Stylistic
      "@typescript-eslint/no-unused-vars": "off", // Handled by unused-imports
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-floating-promises": "off", // Creating too much noise often
      "@typescript-eslint/no-misused-promises": "off",

      // Unused Imports
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],

      "react/no-unknown-property": "off", // Required for React Three Fiber

      // General Good Practices
      "no-console": ["warn", { allow: ["warn", "error", "info"] }],
      eqeqeq: ["error", "always"],
      curly: ["error", "all"],
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  // Storybook overrides
  ...storybook.configs["flat/recommended"],
  // Prettier (Last to override)
  eslintConfigPrettier,
);
