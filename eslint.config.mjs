import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    ignores: [
      "node_modules/",
      "dist/",
      "build/",
      "coverage/",
      ".yarn/",
      ".zed/",
      "public/",
    ],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.node },
    rules: {
      "no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
    },
  },
  { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
]);
