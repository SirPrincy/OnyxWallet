<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Onyx Wallet

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/66b3493f-305b-43b2-b942-211fd28c89fb

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Android Build and Deployment (CLI)

You can build the application without installing Android Studio by using the command line.

### 1. Requirements
- **Java Development Kit (JDK) 21** or higher.
- Android SDK Command-line Tools (if you want to avoid Android Studio entirely).

### 2. Build Process
Run these commands from the project root:
```bash
# 1. Build the web project
npm run build

# 2. Sync changes with Capacitor
npx cap sync android

# 3. Build the Android APK using the Gradle wrapper
cd android
chmod +x gradlew
./gradlew assembleDebug
```

### 3. Troubleshooting "Problem parsing the package"
If you get this error on your phone:
- **SDK Compatibility**: Currently, the project is set to `targetSdkVersion 36`. This is a very new version (Android 16 preview). If your phone shows a parsing error, it's likely because it doesn't support API 36 yet. To fix this, you can try lowering `targetSdkVersion` and `compileSdkVersion` to **35** in `android/variables.gradle`.
- **Clean Build**: Try running `./gradlew clean` inside the `android` directory before building again.
- **Minimum Version**: Ensure your phone is running at least Android 7.0 (API 24).

### 4. Installation
- The generated APK is located at: `android/app/build/outputs/apk/debug/app-debug.apk`.
- Transfer this file to your phone and open it to install.

### Note on Compiler Warnings
You may see warnings like "[advice] Some input files use unchecked or unsafe operations" during the build. These are harmless Java linting messages from the SQLite plugin and can be safely ignored.
