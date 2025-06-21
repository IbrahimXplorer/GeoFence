# 🛰️ Geofence App

This is a **React Native** project bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

---

## 📌 Project Overview

The **Geofence App** allows users to create and manage geofences on an interactive map. It leverages device location services and sends **local notifications** when users enter or exit a geofenced area.

### ✅ Features Implemented

- Native splash screen using **react-native-bootsplash**
- Interactive map with **custom circular and polygonal fences**
- Local push notifications using **Notifee**
- Real-time **geofence entry/exit detection**
- Persistent **local storage of fences**
- **Customizable stroke and fill colors** using **reanimated-color-picker**

---

## 🚀 Getting Started

> **Note**: Ensure you’ve completed the official [React Native Environment Setup](https://reactnative.dev/docs/environment-setup) before proceeding.

### 1. Install Dependencies

```sh
npm install
# OR
yarn install
```

### 2. iOS Only – Install CocoaPods

Navigate to the `ios` directory and install pods:

```sh
cd ios
pod install
cd ..
```

> If you're using `Bundler`, run:

```sh
bundle install
bundle exec pod install
```

### 3. Start the Metro Bundler

```sh
npm start
# OR
yarn start
```

### 4. Run the App

#### Android

```sh
npm run android
# OR
yarn android
```

#### iOS

```sh
npm run ios
# OR
yarn ios
```

---

## 🎯 Task Completed

All core features for the **Geofence App** have been successfully implemented.

---

Thanks for reviewing the project!
