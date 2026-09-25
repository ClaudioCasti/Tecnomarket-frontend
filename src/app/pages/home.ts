import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  template: `
    <section class="hero">
      <h1>TecnoMarket</h1>
      <p>
        Gestión de pedidos y productos sobre microservicios en AWS, protegida con Amazon Cognito
        (OAuth 2.0 / OpenID Connect con Authorization Code + PKCE).
      </p>
    </section>

    @if (aviso() === 'login') {
      <div class="alert warn">Debes iniciar sesión para acceder a esa sección.</div>
    }
    @if (aviso() === 'rol') {
      <div class="alert warn">Tu usuario no pertenece al grupo necesario para acceder a esa sección.</div>
    }
    @if (auth.error()) {
      <div class="alert error">{{ auth.error() }}</div>
    }

    @if (auth.claims(); as c) {
      <div class="card">
        <h2>Sesión iniciada</h2>
        <p>
          Usuario: <strong>{{ c.usuario }}</strong>
        </p>
        <p>
          Grupos:
          @for (g of c.grupos; track g) {
            <span class="badge">{{ g }}</span>
          } @empty {
            <span class="muted">sin grupo asignado</span>
          }
        </p>
        <p class="actions">
          <a class="btn" routerLink="/pedidos">Ver pedidos</a>
          <a class="btn ghost" routerLink="/productos">Ver productos</a>
          <a class="btn ghost" routerLink="/perfil">Ver mi perfil y token</a>
        </p>
      </div>
    } @else {
      <div class="card">
        <h2>Comienza aquí</h2>
        <p>
          El inicio de sesión y el registro se realizan en la pantalla de Amazon Cognito. Si aún no tienes
          cuenta, usa el enlace <em>Sign up</em> de esa pantalla.
        </p>
        <p class="actions">
          <button class="btn" (click)="auth.login()">Iniciar sesión / Registrarse</button>
        </p>
      </div>
    }
  `,
})
export class HomePage {
  protected readonly auth = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  protected readonly aviso = toSignal(this.route.queryParamMap.pipe(map((p) => p.get('aviso'))), {
    initialValue: null,
  });
}
