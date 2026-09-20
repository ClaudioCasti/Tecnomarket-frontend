import { Component, inject } from '@angular/core';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-admin',
  template: `
    <h1>Administración</h1>
    <div class="card">
      <h2>Área solo para administradores</h2>
      <p>
        Esta ruta está protegida por <code>roleGuard('admin')</code>, que lee el claim
        <code>cognito:groups</code> del token. Solo los usuarios del grupo <strong>admin</strong> llegan aquí.
      </p>
      <p>
        Tus grupos:
        @for (g of auth.claims()?.grupos ?? []; track g) {
          <span class="badge">{{ g }}</span>
        }
      </p>
    </div>
  `,
})
export class AdminPage {
  protected readonly auth = inject(AuthService);
}
