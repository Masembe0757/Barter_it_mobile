/**
 * Universal Babel Configuration
 * Works with both Expo and React Native CLI
 */
module.exports = function(api) {
  api.cache(true);

  const isExpo = process.env.EXPO_ROUTER_APP_ROOT || process.env.EXPO;

  return {
    presets: [
      isExpo ? 'babel-preset-expo' : 'module:@react-native/babel-preset'
    ],
    plugins: [
      // Required for React Native Reanimated
      ['react-native-reanimated/plugin', {
        relativeSourceLocation: true,
      }],
      // Environment variable support
      ['module:react-native-dotenv', {
        moduleName: '@env',
        path: '.env',
        safe: false,
        allowUndefined: true,
      }],
    ],
  };
};