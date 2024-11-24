// .eslintrc.js
module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'next/core-web-vitals',
  ],
  plugins: ['react', '@typescript-eslint'],
  rules: {
    '@typescript-eslint/no-unused-vars': ['error'],
    // Disable ban-types error
    "@typescript-eslint/ban-types": "off",
    
    // Allow empty interfaces
    "@typescript-eslint/no-empty-interface": "off",

    // Allow any for now - we'll fix these gradually
    "@typescript-eslint/no-explicit-any": "off",

    // React specific
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    
    // JSX quotes and apostrophes
    "react/no-unescaped-entities": ["error", {
      "forbid": [">", "}"]
    }],

    // Allow img elements
    "@next/next/no-img-element": "off",

    // Hooks dependencies
    "react-hooks/exhaustive-deps": "warn",

    // Import rules
    "import/no-anonymous-default-export": "off"
  },
  settings: {
    react: {
      version: "detect"
    }
  }
};