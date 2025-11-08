<!-- # React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
``` -->

flowchart TD
  subgraph "Edge & Frontend"
    CDN[CDN (S3/CloudFront or Vercel/Netlify)]
    Browser[Browser SPA (React)]
  end

  subgraph "Kubernetes / Cloud Infra"
    Ingress[Ingress / API Gateway (Traefik/Kong/API GW)]
    BFF[BFF / API Gateway (Node/Express) / GraphQL]
    Auth[Auth Service (Keycloak / OIDC)]
    LB[LoadBalancer]
    Redis[Redis (cache / session)]
  end

  subgraph "Microservices (K8s)"
    ProductSvc[Product Service]
    SearchSvc[Search Service / Indexer]
    ChatSvc[Chat Service (WebSocket/RTC)]
    NotifSvc[Notification Service (email/sms/push)]
    WorkerSvc[Worker Pool (image processing, indexing)]
    UserSvc[User/Profile Service]
  end

  subgraph "Data & Messaging"
    Mongo[MongoDB Replica Set]
    ES[Elasticsearch Cluster]
    Kafka[Kafka Cluster]
    MinIO[Object Storage (S3/MinIO) - product images]
  end

  subgraph "Observability & Infra Services"
    Prom[Prometheus/Grafana]
    Jaeger[Jaeger / OpenTelemetry]
    ELK[ELK / EFK Logs]
  end

  %% Edge flows
  Browser -->|HTTPS| CDN
  Browser -->|HTTPS (API calls, WebSockets)| Ingress

  Ingress --> BFF
  Browser -. websocket .-> ChatSvc

  BFF --> Auth
  BFF --> ProductSvc
  BFF --> SearchSvc
  BFF --> ChatSvc
  BFF --> NotifSvc
  BFF --> UserSvc

  %% Product flow
  ProductSvc -->|store metadata| Mongo
  ProductSvc -->|upload image to| MinIO
  ProductSvc -->|emit product.created| Kafka

  %% Indexing flow
  Kafka -->|product.created| WorkerSvc
  WorkerSvc -->|generate thumbnails/optimize| MinIO
  WorkerSvc -->|index doc| ES

  SearchSvc --> ES
  SearchSvc --> Mongo

  %% Chat flow
  ChatSvc --> Kafka
  ChatSvc --> Mongo

  %% Notification flow
  ProductSvc -->|product.created| Kafka
  Kafka --> NotifSvc
  NotifSvc -->|email/sms/push| External[External Providers (SES/Twilio/FCM)]

  %% Observability
  ProductSvc --> Prom
  ChatSvc --> Jaeger
  WorkerSvc --> ELK

  %% Users & sessions
  Auth --> Mongo
  BFF --> Redis

  %% Arrows for storage visibility
  ProductSvc --> ES