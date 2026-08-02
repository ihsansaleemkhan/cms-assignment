# CMS Assignment Mobile App

Read-only Expo and React Native client for the CMS Assignment Laravel public API. It displays published content through dynamic nested menus, supports English and Arabic, and requires no login.

## Features

- Public CMS content without authentication
- Dynamic parent and child menus
- Searchable and paginated menu pages
- Page-detail reading screen and cover images
- English/Arabic language switching
- Right-to-left Arabic layout
- Responsive navigation drawer
- Pull-to-refresh and localized dates
- Android, iOS, and web targets through Expo

## Tech Stack and Versions

| Tool                       | Project version |
| -------------------------- | --------------- |
| Expo SDK                   | 57.0.9          |
| Expo Router                | 57.0.9          |
| React Native               | 0.86.2          |
| React                      | 19.2.3          |
| TypeScript                 | 6.0.3           |
| Gradle wrapper             | 9.3.1           |
| Android JDK                | OpenJDK 17      |
| Android compile/target SDK | API 36          |

Exact JavaScript versions are recorded in package.json and package-lock.json.

## Requirements

### All platforms

- Node.js 20.19.4+, 22.13.0+, or another version supported by React Native 0.86
- npm 10+
- Git
- A running CMS Assignment Laravel backend

Node.js 22 LTS is recommended. This project was verified locally with:

```text
Node.js 22.21.0
npm 10.9.4
OpenJDK 17.0.20
```

### Android

- Windows, macOS, or Linux
- Android Studio
- Android SDK Platform 36
- Android SDK Build Tools and Platform-Tools
- Android Emulator with an API 36 image, or a physical Android device
- OpenJDK 17
- ANDROID_HOME configured for the Android SDK

Expo SDK 57 supports Android 7 and newer and compiles/targets API 36.

### iOS

- macOS
- Xcode 26.4 or newer for Expo SDK 57
- CocoaPods
- iOS Simulator or physical iOS device

Native iOS compilation cannot be performed on Windows.

## Backend Prerequisites

Install and start the Laravel backend first:

```bash
cd cms-assignment-backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan storage:link
php artisan serve
```

The default backend URL is http://127.0.0.1:8000. The storage link is required for public cover images.

## Installation

```bash
git clone https://github.com/ihsansaleemkhan/cms-assignment.git
cd cms-mobile-app
npm install
```

If the mobile app is stored in another folder inside the cloned repository, adjust the cd command accordingly.

## API Configuration

Create a .env file in the mobile project root:

```env
EXPO_PUBLIC_API_URL=http://X.X.X.X:8000/api
```

Choose the URL based on the runtime:

| Runtime                     | API URL example               |
| --------------------------- | ----------------------------- |
| Android Studio emulator     | http://10.0.2.2:8000/api      |
| Physical Android/iOS device | http://192.168.1.100:8000/api |
| iOS Simulator               | http://127.0.0.1:8000/api     |
| Web on the backend computer | http://127.0.0.1:8000/api     |

10.0.2.2 is the Android emulator alias for the host computer. Do not use 127.0.0.1 from an Android emulator or physical device because it points to that device.

For a physical device:

1. Connect the computer and phone to the same network.
2. Find the computer's LAN IPv4 address.
3. Start Laravel on the network:

   ```bash
   php artisan serve --host=0.0.0.0 --port=8000
   ```

4. Put the LAN address in EXPO_PUBLIC_API_URL.
5. Allow PHP/Laravel through the firewall when prompted.

Restart Expo after changing .env.

## Run the App

Start Expo:

```bash
npm start
```

From the Expo terminal, press a for Android, i for iOS on macOS, or w for web.

### Android native build

Start an emulator or connect a USB-debugging device:

```bash
npm run android
```

Equivalent command:

```bash
npx expo run:android
```

The first Android build compiles native C++ dependencies and may take several minutes. Later builds reuse Gradle and native caches.

### iOS

On macOS:

```bash
npm run ios
```

If the native iOS directory does not exist:

```bash
npx expo prebuild --platform ios
npx expo run:ios
```

### Web

```bash
npm run web
```

## Public APIs

The app uses only public endpoints. No CMS account or bearer token is required.

| Method | Endpoint                                  | Description                                    |
| ------ | ----------------------------------------- | ---------------------------------------------- |
| GET    | /api/public/menus                         | Active nested menus with published pages       |
| GET    | /api/public/pages?page=1&search=&menu_id= | Paginated pages with search and menu filtering |
| GET    | /api/public/pages/{slug}                  | Published page detail                          |

A visible page must be published, due, not deleted, and assigned to an active menu.

## English and Arabic

Supported languages are en and ar. Content fallback rules:

```text
Arabic title: title_ar || title
Arabic body: body_ar || body
English title: title || title_ar
English body: body || body_ar
```

Arabic mode updates text alignment, drawer placement, navigation direction, and dates.

## Available Scripts

| Command          | Description                     |
| ---------------- | ------------------------------- |
| npm start        | Start Expo                      |
| npm run android  | Compile and run Android         |
| npm run ios      | Compile and run iOS on macOS    |
| npm run web      | Start the web target            |
| npm run lint     | Run Expo ESLint when configured |
| npx tsc --noEmit | Validate TypeScript             |

## Main Project Structure

```text
src/
├── app/
│   ├── _layout.tsx
│   ├── index.tsx
│   ├── menu/[id].tsx
│   └── page/[slug].tsx
├── lib/
│   ├── api.ts
│   ├── html.ts
│   └── localization.ts
├── providers/
│   └── language-provider.tsx
└── components/

android/
assets/
app.json
package.json
```

## Build Verification

```bash
npm install
npx tsc --noEmit
npm run lint
```

Also verify:

- Public menus and pages load.
- Parent and child menus appear in the drawer.
- Search, filtering, and pagination work.
- Page details and cover images load.
- English and Arabic layouts align correctly.
- Missing Arabic content falls back to English.
- The app never requests login or protected APIs.

## Android Build Notes

The project builds these architectures:

```text
armeabi-v7a, arm64-v8a, x86, x86_64
```

For a faster emulator-only build, android/gradle.properties can temporarily use:

```properties
reactNativeArchitectures=x86_64
```

Use arm64-v8a for most modern physical devices. Restore all required architectures before a general release.

Windows hard-link warnings are expected when the Gradle cache and project are on different drives; Gradle falls back to copying.

## Troubleshooting

### API cannot be reached

- Confirm Laravel is running.
- Confirm EXPO_PUBLIC_API_URL ends with /api.
- Use 10.0.2.2 from an Android Studio emulator.
- Use the computer's LAN IP from a physical device.
- Check the firewall and backend CORS configuration.
- Restart Expo after changing .env.

### Cover images do not load

```bash
php artisan storage:link
```

Confirm Laravel returns a URL reachable from the device. The app converts cover-image hosts using 127.0.0.1 or localhost to the configured API host.

### Metro cache

```bash
npx expo start --clear
```

### Android clean build

Stop the active Gradle build first, then run:

```powershell
Set-Location android
.\gradlew.bat clean
Set-Location ..
npm run android
```

### Dependency compatibility

Use Expo's compatible installer:

```bash
npx expo install package-name
npx expo-doctor
```

Avoid replacing Expo-managed versions with arbitrary latest releases.

## Security Notes

- The app is intentionally public and read-only.
- It stores no credentials or API tokens.
- It calls only /api/public/\* endpoints.
- Publishing rules remain enforced by Laravel.
- Do not commit private environment values, signing keys, generated builds, or node_modules.

## Author

**Mohomed Ihsan Saleemkhan**  
Senior Software Engineer
