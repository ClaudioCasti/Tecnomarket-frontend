import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-perfil',
  imports: [DatePipe],
  template: `
    <h1>Mi perfil</h1>

    @if (auth.claims(); as c) {
      <div class="card">
        <h2>Datos leídos de los claims del token</h2>
        <table class="kv">
          <tbody>
            <tr>
              <th>Usuario</th>
              <td>{{ c.usuario }}</td>
            </tr>
            <tr>
              <th>Grupos (roles)</th>
              <td>
                @for (g of c.grupos; track g) {
                  <span class="badge">{{ g }}</span>
                } @empty {
                  <span class="muted">sin grupo asignado</span>
                }
              </td>
            </tr>
            <tr>
              <th>Scopes</th>
              <td>
                @for (s of c.scopes; track s) {
                  <span class="badge">{{ s }}</span>
                }
              </td>
            </tr>
            <tr>
              <th>El token expira</th>
              <td>{{ c.expira | date: 'dd-MM-yyyy HH:mm:ss' }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="card">
        <div class="row">
          <h2>Access token</h2>
          <button class="btn ghost" (click)="copiar()">{{ copiado() ? 'Copiado' : 'Copiar token' }}</button>
        </div>
        <p class="muted">
          Úsalo como <code>Authorization: Bearer …</code> para probar las rutas con curl o Postman. Es una
          credencial temporal: no la compartas.
        </p>
        <details>
          <summary>Mostrar token</summary>
          <textarea readonly rows="8">{{ auth.token() }}</textarea>
        </details>
      </div>
    }
  `,
})
export class PerfilPage {
  protected readonly auth = inject(AuthService);
  protected readonly copiado = signal(false);

  protected async copiar(): Promise<void> {
    await navigator.clipboard.writeText(this.auth.token());
    this.copiado.set(true);
    setTimeout(() => this.copiado.set(false), 2000);
  }
}
