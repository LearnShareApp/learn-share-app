export default {
  expo: {
    name: "Learn&Share",
    slug: "learn-share-app",
    scheme: "learn-share-app-scheme",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.jpg",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/icon.jpg",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: true,
      bitcode: false,
      bundleIdentifier: "com.ijustseen.learnshareapp",
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/icon.jpg",
        backgroundColor: "#ffffff",
      },
      package: "com.ijustseen.learnshareapp",
      permissions: [
        "android.permission.ACCESS_NETWORK_STATE",
        "android.permission.CAMERA",
        "android.permission.INTERNET",
        "android.permission.MODIFY_AUDIO_SETTINGS",
        "android.permission.RECORD_AUDIO",
        "android.permission.SYSTEM_ALERT_WINDOW",
        "android.permission.WAKE_LOCK",
        "android.permission.BLUETOOTH",
      ],
    },
    web: {
      favicon: "./assets/icon.jpg",
    },
    plugins: [
      "expo-router",
      [
        "expo-video",
        {
          supportsBackgroundPlayback: true,
          supportsPictureInPicture: true,
        },
      ],
      [
        "expo-image-picker",
        {
          photosPermission:
            "The app accesses your photos to let you share them with your friends.",
        },
      ],
      "expo-font",
      "@livekit/react-native-expo-plugin",
      "@config-plugins/react-native-webrtc",
      [
        "expo-secure-store",
        {
          configureAndroidBackup: true,
          faceIDPermission:
            "Allow $(PRODUCT_NAME) to access your Face ID biometric data.",
        },
      ],
      "expo-localization",
    ],
    extra: {
      API_URL: process.env.API_URL,
      LiveKit_URL: process.env.LiveKit_URL,
      router: {
        origin: false,
      },
      eas: {
        projectId: "b3943be9-5b57-496d-8e4e-d550acb465f4",
      },
    },
  },
};
