module.exports = {
  exclude: 'node_modules/**',
  presets: [
    [
      '@babel/preset-env',
      {
        modules: false,
        debug: true,
        targets: 'chrome >= 66, ie >= 8',
        corejs: {
          version: 3
        }
      }
    ]
  ]
};
