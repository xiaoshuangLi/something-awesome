module.exports = {
  extends: [
    './es',
    './import',
    './jsx-a11y',
    './react',
  ].map(require.resolve),
};
