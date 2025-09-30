# 🚀 BarterHub Mobile - Dual Expo & React Native Configuration

## Complete Setup for Both Expo Go and React Native CLI

This app is now configured to work seamlessly with both **Expo Go** for rapid development and **React Native CLI** for production builds.

---

## 📱 Quick Start Guide

### Option 1: Expo Go (Fastest - No Native Setup Required)
Perfect for rapid development and testing

```bash
# Start with Expo
npm run expo

# Or with cache clear
npm run expo:clear

# For specific platforms
npm run expo:ios      # iOS Simulator
npm run expo:android  # Android Emulator
npm run expo:web      # Web Browser
```

### Option 2: React Native CLI (Full Features)
For production builds and native module access

```bash
# Start Metro bundler
npm run rn:start

# Run on devices
npm run rn:ios      # iOS (requires Xcode)
npm run rn:android  # Android (requires Android Studio)
```

---

## 🏗️ Architecture Overview

### Dual Configuration Structure

```
BarterHub Mobile/
├── index.js              # React Native CLI entry
├── index.expo.js         # Expo entry point
├── App.tsx               # Main app component
├── App.wrapper.tsx       # Smart wrapper with environment detection
├── metro.config.js       # React Native Metro config
├── metro.config.expo.js  # Expo Metro config
├── babel.config.js       # Current babel config
└── babel.config.universal.js  # Universal babel config
```

### How It Works

1. **Environment Detection**: The app automatically detects whether it's running in Expo Go or React Native CLI
2. **Conditional Loading**: Features like Stripe are conditionally loaded based on the environment
3. **Unified Codebase**: Single codebase works for both platforms

---

## 🛠️ Available Scripts

### Expo Commands
- `npm run expo` - Start Expo development server
- `npm run expo:start` - Start with cache clear
- `npm run expo:ios` - Run on iOS simulator
- `npm run expo:android` - Run on Android emulator
- `npm run expo:web` - Run in web browser
- `npm run expo:tunnel` - Start with tunnel for external access
- `npm run expo:clear` - Clear cache and start

### React Native Commands
- `npm start` - Start React Native Metro bundler
- `npm run rn:start` - Start with cache reset
- `npm run rn:ios` - Build and run iOS app
- `npm run rn:android` - Build and run Android app

### Utility Commands
- `npm run clean` - Clean install all dependencies
- `npm run lint` - Run ESLint
- `npm test` - Run tests

---

## 🎯 Feature Compatibility

| Feature | Expo Go | React Native CLI | Notes |
|---------|---------|------------------|-------|
| Basic UI | ✅ | ✅ | Full support |
| Navigation | ✅ | ✅ | React Navigation |
| Authentication | ✅ | ✅ | Context-based |
| Stripe Payments | ⚠️ | ✅ | Disabled in Expo Go |
| Image Picker | ✅ | ✅ | Full support |
| Async Storage | ✅ | ✅ | Full support |
| Push Notifications | ⚠️ | ✅ | Limited in Expo Go |
| Custom Native Modules | ❌ | ✅ | CLI only |

---

## 🔧 Configuration Details

### Babel Configuration
The app uses a smart babel configuration that detects the environment:

```javascript
// babel.config.universal.js
const isExpo = process.env.EXPO_ROUTER_APP_ROOT || process.env.EXPO;
presets: [
  isExpo ? 'babel-preset-expo' : 'module:@react-native/babel-preset'
]
```

### Metro Configuration
Two separate Metro configs for optimal performance:
- `metro.config.js` - React Native CLI
- `metro.config.expo.js` - Expo optimized

### Environment Variables
Using `react-native-dotenv` for environment variables:
```bash
# .env file
API_URL=https://api.barterhub.com
STRIPE_KEY=pk_test_your_key_here
```

---

## 🚨 Troubleshooting

### Expo Go Issues

**"Something went wrong" error:**
1. Clear cache: `npm run expo:clear`
2. Ensure same WiFi network
3. Try manual URL: `exp://[YOUR-IP]:8081`

**Stripe not working:**
- This is expected - Stripe is disabled in Expo Go for compatibility

### React Native CLI Issues

**Metro bundler issues:**
```bash
# Reset cache
npx react-native start --reset-cache

# Clean build
cd android && ./gradlew clean && cd ..
cd ios && pod install && cd ..
```

**Build failures:**
```bash
# Android
cd android && ./gradlew clean
./gradlew assembleDebug

# iOS
cd ios
pod deintegrate
pod install
```

---

## 📦 Dependencies Management

### Core Dependencies
- React Native 0.81.4
- Expo SDK 54
- React 19.1.0
- TypeScript

### Key Libraries
- **Navigation**: React Navigation 7
- **UI**: React Native Paper 5
- **State**: React Query, Context API
- **Forms**: React Hook Form
- **Payments**: Stripe React Native

---

## 🔄 Migration Path

### From Expo Go to Production

1. **Development Phase**: Use Expo Go for rapid iteration
2. **Testing Phase**: Test with `expo run:ios` or `expo run:android`
3. **Production Build**:
   ```bash
   # EAS Build
   eas build --platform all

   # Or React Native CLI
   npx react-native run-ios --configuration Release
   npx react-native run-android --variant=release
   ```

---

## 🎨 Development Workflow

### Recommended Setup

1. **Initial Development**: Use Expo Go
   - Fast refresh
   - No build times
   - Instant testing

2. **Feature Development**: Switch between both
   - Expo for UI/UX
   - CLI for native features

3. **Testing**: Use React Native CLI
   - Full feature testing
   - Performance optimization

4. **Production**: React Native CLI or EAS Build
   - Optimized builds
   - Native performance

---

## 📲 Testing on Devices

### Expo Go
1. Install Expo Go app
2. Scan QR code from terminal
3. Instant updates with Fast Refresh

### React Native CLI
1. Enable Developer Mode on device
2. Connect via USB
3. Run `npm run rn:android` or `npm run rn:ios`

---

## 🔐 Security Notes

- Never commit `.env` files
- Use environment-specific configs
- Stripe keys should be in environment variables
- API endpoints should be configurable

---

## 📚 Resources

- [Expo Documentation](https://docs.expo.dev)
- [React Native Docs](https://reactnative.dev)
- [React Navigation](https://reactnavigation.org)
- [React Native Paper](https://callstack.github.io/react-native-paper)

---

## ✅ Configuration Complete!

Your BarterHub mobile app is now fully configured for both Expo and React Native CLI development. You have:

1. ✅ Dual entry points for both platforms
2. ✅ Smart environment detection
3. ✅ Conditional feature loading
4. ✅ Optimized Metro and Babel configs
5. ✅ Comprehensive npm scripts
6. ✅ Full documentation

**You can now develop with the speed of Expo Go and deploy with the power of React Native CLI!**

---

Happy Coding! 🎉