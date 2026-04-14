# Mecenate App

iOS + Android приложение на React Native + Expo.

## Стек

- **React Native** + **Expo SDK 54** (expo-router)
- **TypeScript**
- **MobX** + **React Query** — state management
- **React Native Reanimated 3** — анимации
- **Expo Haptics** — haptic feedback
- **Axios** — HTTP-клиент

## Запуск

### 1. Установить зависимости

```bash
npm install
```

### 2. Переменные окружения

```bash
cp .env.example .env
```

| Переменная | Описание |
|---|---|
| `EXPO_PUBLIC_API_URL` | Base URL REST API |
| `EXPO_PUBLIC_WS_URL` | WebSocket URL |
| `EXPO_PUBLIC_AUTH_TOKEN` | UUID токен авторизации |

### 3. Запустить

```bash
# Expo Go (iOS + Android)
npm start

# только iOS
npm run ios

# только Android
npm run android
```

Открыть в **Expo Go** — отсканировать QR-код.

## DX команды

```bash
npm run lint          # ESLint
npm run lint:fix      # ESLint с автофиксом
npm run format        # Prettier
npm run type-check    # TypeScript проверка
```

## Структура проекта

Feature-Sliced Design (FSD).

```
app/
  _layout.tsx           # Root layout (QueryClient + навигация)
  index.tsx             # Экран Feed
  post/[id].tsx         # Экран Post Detail

src/
  shared/
    api/client.ts       # axios instance
    lib/
      websocket.ts      # WebSocket сервис
      useCountAnimation.ts
    theme/index.ts      # Design tokens
    types/index.ts      # TypeScript типы
    ui/                 # Переиспользуемые компоненты

  entities/
    post/               # Сущность Post (api, model, ui)
    comment/            # Сущность Comment (api, model, ui)

  features/
    like-post/          # Фича лайка поста
    send-comment/       # Фича отправки комментария
    filter-feed/        # Фича фильтрации ленты
```

## API

- REST: `https://k8s.mectest.ru/test-app` ([Swagger](https://k8s.mectest.ru/test-app/openapi.json))
- WebSocket: `wss://k8s.mectest.ru/test-app/ws?token=<UUID>`
