# Instructions for developers

## For Copying use

```npm
git clone https://github.com/LearnShareApp/learn-share-app.git
```

## Then install dependencies

```npm
npm i
```

## And start project with

```npm
npx expo start
//or
npx expo start -c
```


# Learn&Share - Техническое описание
## Общее описание
Learn&Share - это мобильное приложение для обмена знаниями, где пользователи могут выступать как в роли учеников, так и преподавателей. Приложение разработано с использованием React Native и Expo.
# Технологический стек
## Основные технологии
 - React Native (версия 0.76.6)
 - Expo (версия 52.0.25)
 - TypeScript
 - Node.js

## Ключевые библиотеки
```
  "dependencies": {
    "@config-plugins/react-native-webrtc": "^10.0.0",
    "@expo-google-fonts/inter": "^0.2.3",
    "@hookform/resolvers": "^3.9.1",
    "@livekit/react-native": "^2.5.1",
    "@livekit/react-native-expo-plugin": "^1.0.1",
    "@livekit/react-native-webrtc": "^125.0.7",
    "@react-native-async-storage/async-storage": "1.23.1",
    "@react-native-community/datetimepicker": "8.2.0",
    "axios": "^1.7.9",
    "expo": "~52.0.25",
    "expo-clipboard": "~7.0.1",
    "expo-constants": "~17.0.4",
    "expo-dev-client": "~5.0.10",
    "expo-file-system": "~18.0.7",
    "expo-font": "~13.0.3",
    "expo-linking": "~7.0.4",
    "expo-localization": "~16.0.1",
    "expo-navigation-bar": "^4.0.7",
    "expo-router": "~4.0.11",
    "expo-secure-store": "~14.0.1",
    "expo-splash-screen": "~0.29.21",
    "expo-status-bar": "~2.0.1",
    "expo-video": "~2.0.5",
    "fbemitter": "^3.0.0",
    "i18next": "^24.2.1",
    "install": "^0.13.0",
    "livekit-server-sdk": "^2.9.5",
    "lucide-react-native": "^0.473.0",
    "pnpm": "^9.15.4",
    "react": "18.3.1",
    "react-hook-form": "^7.54.2",
    "react-i18next": "^15.4.0",
    "react-native": "0.76.6",
    "react-native-date-picker": "^5.0.8",
    "react-native-dropdown-picker": "^5.4.6",
    "react-native-mmkv": "^3.2.0",
    "react-native-safe-area-context": "4.12.0",
    "react-native-screens": "~4.4.0",
    "react-native-sticky-parallax-header": "^1.0.0-rc.9",
    "react-native-toast-notifications": "^3.4.0",
    "react-native-webview": "13.12.5",
    "react-native-youtube-iframe": "^2.3.0",
    "rimraf": "^6.0.1",
    "zod": "^3.24.1"
  },

```


## Навигация и роутинг
 - expo-router
 - react-native-screens
 - react-native-safe-area-context

## Состояние и формы
 - react-hook-form
 - zod (валидация)
 - @hookform/resolvers

## UI компоненты
 - react-native-dropdown-picker
 - react-native-toast-notifications
 - react-native-sticky-parallax-header

## Мультимедиа и коммуникации
 - @livekit/react-native (видеозвонки)
 - react-native-webrtc
 - FontAwesome (иконки)

## Хранение данных
 - expo-secure-store

## Локализация
 - i18next
 - react-i18next
 - expo-localization


# Архитектура приложения

## Структура проекта
```
|──android - настройки сборки на android
|──assets - хранение дополнительных ресурсов 
|──ios - настройки сборки на ios 
|--src 
|  |──app - основные экраны приложения
|  |──cmponents - переиспользуемые компоненты
|  |──utilities - утилиты и хуки
|  |──providers - провайдеры контекста
|  └──locales - файлы локализации
```

## Основной функционал
### Аутентификация
 - Регистрация
 - Авторизация
 - Защищенное хранение токенов

### Профиль преподавателя
 - Управление навыками
 - Расписание занятий
 - Статистика

### Система бронирования
 - Поиск преподавателей
 - Выбор времени
 - Подтверждение занятий

### Видеозвонки
 - WebRTC интеграция
 - Управление звуком/видео

### Мультиязычность
 - Поддержка русского
 - Поддержка английского
 - Поддержка сербского
 - Поддержка немецкого
 - Поддержка французского

## Безопасность
- Защищенное хранение токенов
- Валидация форм на клиенте

## Нативные возможности
 - Камера
 - Микрофон
 - Фоновое воспроизведение
 - API интеграция

## Поддерживаемые платформы
- iOS (минимальная версия 15.1)
- Android

## Системные требования
- Доступ к камере
- Доступ к микрофону
- Интернет-соединение
- Поддержка WebRTC

