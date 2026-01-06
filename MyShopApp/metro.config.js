const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// For web support
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  'react-native': require.resolve('react-native-web'),
};

// Add web platform explicitly
config.resolver.platforms = [...(config.resolver.platforms || []), 'web'];

// Don't use Hermes for web
config.transformer = {
  ...config.transformer,
  experimentalImportSupport: true,
  inlineRequires: true,
};

module.exports = config;



