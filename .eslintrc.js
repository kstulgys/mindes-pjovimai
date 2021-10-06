module.exports = {
  plugins: ["@typescript-eslint"],
  parser: "@typescript-eslint/parser",
  extends: [
    "next",
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "prettier",
    "plugin:valtio/recommended",
  ],
  rules: {
    // I suggest you add at least those two rules:
    // "@typescript-eslint/no-unused-vars": "error",
    // "@typescript-eslint/no-explicit-any": "error"
    "no-unused-vars": "off",
    "no-use-before-define": "off",
    "valtio/state-snapshot-rule": "warn",
    "valtio/avoid-this-in-proxy": "warn",
    "react/react-in-jsx-scope": "off",
  },
}
