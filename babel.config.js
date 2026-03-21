module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: ['.ts', '.tsx', '.js', '.jsx'],
          alias: {
            '@core': './src/core',
            '@store': './src/store',
            '@shared': './src/shared',
            '@features': './src/features',
            '@navigation': './src/navigation',
            '@theme': './src/theme',
            '@locales': './src/locales',
          },
        },
      ],
    ],
  };
};
