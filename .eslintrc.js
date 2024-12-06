/* eslint-env node */
module.exports = {
    env: {
        node: true,
    },
    extends: ["plugin:@typescript-eslint/recommended", "eslint:recommended"],
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint"],
    root: true,
    rules: {
        "@typescript-eslint/quote-props": "off", // Disable TypeScript's rule
        "quote-props": ["error", "always"], // Enforce quotes around keys
    },
};
