// Completa automáticamente el intercambio del código de autorización al volver desde Cognito.
import 'aws-amplify/auth/enable-oauth-listener';
import { bootstrapApplication } from '@angular/platform-browser';
import { Amplify } from 'aws-amplify';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { SCOPES_SOLICITADOS } from './app/core/scopes';
import { environment } from './environments/environment';

// La URL de retorno es el origen desde el que se sirve el front (localhost o CloudFront);
// debe estar registrada en Cognito como "Allowed callback URL" y "Allowed sign-out URL".
const origen = window.location.origin;

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: environment.cognito.userPoolId,
      userPoolClientId: environment.cognito.userPoolClientId,
      loginWith: {
        oauth: {
          domain: environment.cognito.domain,
          scopes: [...SCOPES_SOLICITADOS],
          redirectSignIn: [origen],
          redirectSignOut: [origen],
          // Authorization Code; Amplify agrega PKCE (code_challenge S256) y state automáticamente.
          responseType: 'code',
        },
      },
    },
  },
});

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
