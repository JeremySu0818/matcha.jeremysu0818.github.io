import js from "@eslint/js";
import { createTypeScriptImportResolver } from "eslint-import-resolver-typescript";
import importX from "eslint-plugin-import-x";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import sonarjs from "eslint-plugin-sonarjs";
import unusedImports from "eslint-plugin-unused-imports";
import globals from "globals";
import tseslint from "typescript-eslint";

const noCommentsPlugin = {
  rules: {
    "no-comments": {
      meta: {
        messages: {
          forbidden: "Code comments are not allowed.",
        },
        schema: [],
        type: "problem",
      },
      create(context) {
        return {
          Program() {
            for (const comment of context.sourceCode.getAllComments()) {
              context.report({ messageId: "forbidden", node: comment });
            }
          },
        };
      },
    },
  },
};

const typedFiles = ["src/**/*.{ts,tsx}", "vite.config.ts", "vitest.config.ts"];
const typedConfigs = [
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
].map((config) => ({ ...config, files: typedFiles }));

export default [
  {
    ignores: ["coverage/**", "dist/**", "node_modules/**"],
  },
  {
    linterOptions: {
      reportUnusedDisableDirectives: "error",
    },
  },
  js.configs.recommended,
  ...typedConfigs,
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      ecmaVersion: "latest",
      globals: globals.node,
      sourceType: "module",
    },
    plugins: {
      quality: noCommentsPlugin,
    },
    rules: {
      "no-warning-comments": ["error", { terms: ["todo", "fixme", "hack", "note", "warning"] }],
      "quality/no-comments": "error",
    },
  },
  {
    files: typedFiles,
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      "import-x": importX,
      quality: noCommentsPlugin,
      react,
      "react-hooks": reactHooks,
      sonarjs,
      "unused-imports": unusedImports,
    },
    settings: {
      "import-x/resolver-next": [
        createTypeScriptImportResolver({
          noWarnOnMultipleProjects: true,
          project: ["tsconfig.json", "tsconfig.node.json"],
        }),
      ],
      react: {
        version: "detect",
      },
    },
    rules: {
      ...react.configs.recommended.rules,
      ...react.configs["jsx-runtime"].rules,
      ...reactHooks.configs.flat.recommended.rules,
      ...sonarjs.configs.recommended.rules,
      "@typescript-eslint/consistent-type-exports": "error",
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { fixStyle: "inline-type-imports", prefer: "type-imports" },
      ],
      "@typescript-eslint/explicit-module-boundary-types": "error",
      "@typescript-eslint/naming-convention": [
        "error",
        {
          format: ["camelCase", "PascalCase", "UPPER_CASE"],
          leadingUnderscore: "forbid",
          selector: "default",
          trailingUnderscore: "forbid",
        },
        {
          format: ["camelCase", "PascalCase", "UPPER_CASE"],
          leadingUnderscore: "forbid",
          selector: "variableLike",
          trailingUnderscore: "forbid",
        },
        {
          format: ["PascalCase"],
          selector: "typeLike",
        },
        {
          format: null,
          modifiers: ["destructured"],
          selector: "variable",
        },
        {
          format: null,
          modifiers: ["requiresQuotes"],
          selector: "property",
        },
      ],
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/prefer-readonly": "error",
      "import-x/no-cycle": ["error", { ignoreExternal: true }],
      "import-x/no-duplicates": "error",
      "import-x/no-self-import": "error",
      "import-x/order": [
        "error",
        {
          alphabetize: { caseInsensitive: true, order: "asc" },
          groups: ["builtin", "external", "internal", "parent", "sibling", "index", "object", "type"],
          "newlines-between": "never",
          pathGroups: [
            {
              group: "external",
              pattern: "react",
              position: "before",
            },
          ],
          pathGroupsExcludedImportTypes: ["react"],
        },
      ],
      "no-unused-vars": "off",
      "no-warning-comments": ["error", { terms: ["todo", "fixme", "hack", "note", "warning"] }],
      "quality/no-comments": "error",
      "react/prop-types": "off",
      "react-hooks/exhaustive-deps": "error",
      "sonarjs/cognitive-complexity": ["error", 20],
      "sonarjs/pseudo-random": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "error",
        { args: "all", argsIgnorePattern: "^$", vars: "all", varsIgnorePattern: "^$" },
      ],
    },
  },
  {
    files: ["src/**/*.{ts,tsx}"],
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    files: ["vite.config.ts", "vitest.config.ts"],
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    files: [
      "src/components/interactive/ToolsShowcase.tsx",
      "src/components/scene/**/*.tsx",
    ],
    rules: {
      "react/no-unknown-property": "off",
    },
  },
];
