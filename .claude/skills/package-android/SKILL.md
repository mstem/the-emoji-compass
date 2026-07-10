---
name: package-android
description: Rebuild the web app and repackage it into the Android wrapper app (emoji-compass-android), then install and smoke-test on a connected device. Use when the web app has changed and the Android app needs updating, or when asked to package, rebuild, ship, or test the Android app.
---

# Package the web app into the Android wrapper

The Android app (`../emoji-compass-android`, sibling repo) is a Kotlin WebView
shell that serves a **bundled copy** of this web app's `dist/` from APK assets.
Every web change requires re-syncing assets and rebuilding the APK.

## Steps

1. **Preflight**
   - Confirm the Android repo exists: `ls ../emoji-compass-android/app` (from this repo's root).
     If missing, stop and tell the user — do not scaffold a new one.
   - Optionally run the web tests first: `npm test`. If they fail, report and ask before packaging.

2. **Sync the web build into Android assets**
   ```sh
   ../emoji-compass-android/scripts/sync-web-build.sh
   ```
   This runs `npm run build` here and copies `dist/` → `app/src/main/assets/`
   (dropping `CNAME`). It prints the synced file count. The assets dir is
   gitignored in the Android repo — never commit it.

3. **Build the debug APK**
   ```sh
   cd ../emoji-compass-android && ./gradlew :app:assembleDebug
   ```
   Output: `app/build/outputs/apk/debug/app-debug.apk`.

4. **Install and launch** (skip gracefully if no device)
   ```sh
   ADB=~/Library/Android/sdk/platform-tools/adb
   $ADB devices   # proceed only if a device is listed
   $ADB install -r app/build/outputs/apk/debug/app-debug.apk
   $ADB shell am force-stop com.biffud.emojicompass
   $ADB shell am start -n com.biffud.emojicompass/.MainActivity
   ```

5. **Smoke-test** — wait ~4s, then screenshot and read it:
   ```sh
   $ADB exec-out screencap -p > <scratchpad>/smoke.png
   ```
   Pass = the compass face with emoji ring renders (not a black screen, not the
   native "Something went wrong" error view). Also check for JS errors:
   `$ADB logcat -d | grep -i console | tail`.

6. **Report** the synced file count, APK size, install result, and the smoke
   screenshot verdict.

## Device etiquette (important)

The attached Pixel is the user's personal daily phone. Installing, launching,
screenshots, and logcat are fine. **Never send `adb shell input` taps/swipes**
unless the user has just confirmed the phone is idle. For interaction testing,
debug builds have WebView debugging enabled — drive touches via Chrome DevTools
Protocol instead (`adb forward tcp:9222 localabstract:webview_devtools_remote_<pid>`,
then CDP `Input.dispatchTouchEvent`; note adb-synthesized swipes don't register
with GSAP Draggable anyway).

## Troubleshooting

- **`checkWebAssets` build failure** — step 2 was skipped; run the sync script.
- **Gradle JVM errors** — the Android repo's `gradle.properties` pins
  `org.gradle.java.home` to Android Studio's bundled JDK 21
  (`/Applications/Android Studio.app/Contents/jbr/Contents/Home`); fix that
  path if Android Studio moved.
- **White/blank WebView** — usually a Vite asset-path problem; confirm
  `app/src/main/assets/index.html` exists and references `/assets/index-*.js`
  (the asset loader serves the assets root at `https://appassets.androidplatform.net/`).

## Release builds (only when asked)

Bump `versionCode`/`versionName` in `app/build.gradle.kts`, then
`./gradlew :app:bundleRelease` — requires a signing config that is not yet set
up; flag this to the user rather than improvising one.
