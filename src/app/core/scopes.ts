/** Scopes de los resource servers creados en Cognito (rs-api-pedidos y rs-api-productos). */
export const SCOPE_PEDIDOS_READ = 'rs-api-pedidos/pedidos-read';
export const SCOPE_PEDIDOS_WRITE = 'rs-api-pedidos/pedidos-write';
export const SCOPE_PRODUCTOS_READ = 'rs-api-productos/productos-read';
export const SCOPE_PRODUCTOS_WRITE = 'rs-api-productos/productos-write';

/**
 * Scopes que el front solicita al iniciar sesión.
 * Se piden solo los de LECTURA: por eso crear un pedido devuelve 403 en el API Gateway
 * (el token no trae el scope de escritura), lo que permite demostrar la autorización por scope.
 */
export const SCOPES_SOLICITADOS = [
  'openid',
  'email',
  'profile',
  SCOPE_PEDIDOS_READ,
  SCOPE_PRODUCTOS_READ,
] as const;
