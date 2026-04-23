#!/bin/bash

# 1. Build du web vers Android
npx cap copy

# 2. Compilation de l'APK (Debug) avec Gradle
cd android
./gradlew assembleDebug
cd ..

# Chemins des fichiers
ORIGINAL_APK="android/app/build/outputs/apk/debug/app-debug.apk"
ALIGNED_APK="android/app/build/outputs/apk/debug/app-aligned.apk"
KEYSTORE="android/app/my-debug.keystore"

# 3. Alignement (Zipalign)
echo "--- Alignement de l'APK ---"
zipalign -f -v 4 "$ORIGINAL_APK" "$ALIGNED_APK"

# 4. Signature (Apksigner)
echo "--- Signature de l'APK ---"
apksigner sign --ks "$KEYSTORE" --ks-pass pass:android "$ALIGNED_APK"

# 5. Vérification
echo "--- Vérification ---"
apksigner verify -v "$ALIGNED_APK"

# 6. Installation (si le téléphone est branché)
echo "--- Tentative d'installation ---"
adb install -r "$ALIGNED_APK"
