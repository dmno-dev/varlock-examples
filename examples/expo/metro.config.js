const { getDefaultConfig } = require('expo/metro-config');
const { withVarlockMetroConfig } = require('@varlock/expo-integration/metro-config');

const config = getDefaultConfig(__dirname);

module.exports = withVarlockMetroConfig(config);
