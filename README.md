# Tecnomarket – Frontend

Aplicación Angular 22 (standalone, zoneless, signals) que consume los microservicios de Tecnomarket
a través de **Amazon API Gateway**, autenticando con **Amazon Cognito** mediante OAuth 2.0 / OpenID Connect
(**Authorization Code + PKCE**, con `state` y `nonce`) usando AWS Amplify Auth.

## Configuración (un solo archivo)

Edita `src/environments/environment.ts`:

| Campo | Dónde obtenerlo |
|---|---|
| `cognito.userPoolId` | Cognito → User pool → Overview |
| `cognito.userPoolClientId` | Cognito → User pool → App clients |
| `cognito.domain` | Cognito → Branding/App integration → Domain (sin `https://`) |
| `apiUrl` | API Gateway → Invoke URL de la etapa (sin `/` final) |

La URL de retorno del login es el origen desde el que se sirve la app (`http://localhost:4200` en desarrollo);
debe estar registrada en Cognito como *Allowed callback URL* y *Allowed sign-out URL*.

## Ejecutar

```powershell
npm install
npm start          # http://localhost:4200
npm test           # 10 pruebas unitarias
npm run build      # salida en dist/
```

Requiere Node.js 22.22.3 o superior.

## Estructura

```
src/app/
├── core/        auth.service (sesión, login con nonce, roles y scopes), guards, interceptor, servicios HTTP
├── pages/       inicio, pedidos, productos, perfil (claims y token), administración (solo grupo admin)
└── app.*        layout, rutas y configuración
```

| Ruta | Protección |
|---|---|
| `/` | pública |
| `/pedidos`, `/productos`, `/perfil` | `authGuard` (sesión iniciada) |
| `/admin` | `roleGuard('admin')` (claim `cognito:groups`) |

## Seguridad

- El interceptor adjunta el access token **solo** a las llamadas hacia `apiUrl`.
- El front solicita únicamente scopes de lectura; crear un pedido devuelve **403** en el API Gateway,
  lo que demuestra la autorización por scope.
- Los roles se leen del claim `cognito:groups` y los scopes del claim `scope` del access token.
