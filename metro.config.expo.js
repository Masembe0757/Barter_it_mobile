/**
 * Metro configuration for Expo
 * Learn more: https://docs.expo.dev/guides/customizing-metro
 */
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add additional asset extensions
config.resolver.assetExts.push('db', 'mp3', 'ttf', 'obj', 'png', 'jpg');

// Add support for SVG files
config.resolver.sourceExts.push('svg');

module.exports = config;