module.exports = {
  extends: ["react-app", "prettier"],
  env: {
    "browser": true,
    "es6": true,
  },
  rules: {
    "default-case": "error",
    "default-case-last": "error",
    "max-depth": ["error", 3],
    "eqeqeq": "warn",
    "no-await-in-loop": "error",
  }
};
