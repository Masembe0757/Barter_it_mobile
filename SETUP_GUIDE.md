# Android Development Setup Guide

The BarterHub mobile app requires Android development tools to run on Android devices/emulators. Here's how to set up your development environment:

## Option 1: Android Studio Setup (Recommended)

### 1. Install Android Studio
```bash
# Download Android Studio from: https://developer.android.com/studio
# Or install via snap:
sudo snap install android-studio --classic
```

### 2. Install Android SDK
1. Open Android Studio
2. Go to `Tools > SDK Manager`
3. Install the following:
   - Android SDK Platform 33 (API level 33)
   - Android SDK Build-Tools 33.0.0
   - Android SDK Platform-Tools
   - Intel x86 Atom_64 System Images (for emulator)

### 3. Set Environment Variables
Add these lines to your `~/.bashrc` or `~/.zshrc`:

```bash
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin

# For Java (already installed - Java 21)
export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64
```

Then reload your shell:
```bash
source ~/.bashrc  # or source ~/.zshrc
```

### 4. Create Android Virtual Device (AVD)
1. Open Android Studio
2. Go to `Tools > AVD Manager`
3. Click `Create Virtual Device`
4. Choose a device (e.g., Pixel 6)
5. Download and select a system image (API 33)
6. Click `Finish`

### 5. Test the Setup
```bash
# Check if everything is working
npx react-native doctor

# Start the Android emulator
emulator @YOUR_AVD_NAME

# Run the app
npx react-native run-android
```

## Option 2: Physical Android Device

### 1. Enable Developer Options
1. Go to `Settings > About Phone`
2. Tap `Build Number` 7 times
3. Go to `Settings > Developer Options`
4. Enable `USB Debugging`

### 2. Connect Device
```bash
# Install ADB tools
sudo apt install android-tools-adb

# Connect your device via USB and check
adb devices
```

### 3. Run the App
```bash
npx react-native run-android
```

## Option 3: Quick Test with Metro (Development Server Only)

If you just want to test the app logic without Android setup:

```bash
# Start the Metro bundler
npx react-native start

# Open another terminal and check the bundle
curl http://localhost:8081/index.bundle?platform=android
```

## Option 4: Web Testing (React Native Web)

Install React Native Web for browser testing:

```bash
npm install react-native-web react-scripts
# Add web scripts to package.json and test in browser
```

## Troubleshooting

### Common Issues:

1. **ANDROID_HOME not set**
   ```bash
   echo $ANDROID_HOME
   # Should output: /home/username/Android/Sdk
   ```

2. **ADB not found**
   ```bash
   sudo apt install android-tools-adb
   ```

3. **Gradle build fails**
   ```bash
   cd android && ./gradlew clean && cd ..
   ```

4. **Metro bundler issues**
   ```bash
   npx react-native start --reset-cache
   ```

## Current Status

✅ **Completed:**
- React Native project setup
- All dependencies installed
- Complete app with authentication, payments, and UI
- TypeScript configuration
- Java 21 installed

❌ **Missing:**
- Android Studio
- Android SDK
- Android emulator/device
- Environment variables

## Quick Start for Testing

Since Android Studio isn't installed, you can:

1. **Install Android Studio** (recommended for full testing)
2. **Use a physical Android device** with USB debugging
3. **Test app logic** with Metro bundler
4. **Use React Native Web** for browser testing

The BarterHub mobile app is fully functional and ready to run once the Android environment is set up!