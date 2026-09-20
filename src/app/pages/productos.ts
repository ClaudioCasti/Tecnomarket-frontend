import { Component, inject, signal } from '@angular/core';
import { Producto } from '../core/models';
import { ProductosService } from '../core/productos.service';
import { Llamada, llamadaError, llamadaOk } from './llamada';

@Component({
  selector: 'app-productos',
  template: `
    <h1>Productos</h1>

    <div class="card">
      <div class="row">
        <h2>Catálogo</h2>
        <button class="btn ghost" (click)="cargar()" [disabled]="cargando()">Actualizar</button>
      </div>
      @if (cargando()) {
        <p class="muted">Cargando…</p>
      } @else if (productos().length === 0) {
        <p class="muted">No hay productos para mostrar.</p>
      } @else {
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Producto</th>
                <th>Precio</th>
                <th>Stock</th>
              </tr>
            </thead>
            <tbody>
              @for (p of productos(); track p.id) {
                <tr>
                  <td>{{ p.id }}</td>
                  <td>{{ p.nombre }}</td>
                  <td>{{ clp(p.precio) }}</td>
                  <td>{{ p.stock }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>

    @if (llamada(); as l) {
      <div class="panel" [class.ok]="l.ok" [class.fail]="!l.ok">
        <span class="method">{{ l.metodo }}</span> {{ l.ruta }} →
        <strong>{{ l.estado === 0 ? 'sin respuesta' : l.estado }}</strong> · {{ l.mensaje }}
      </div>
    }
  `,
})
export class ProductosPage {
  private readonly servicio = inject(ProductosService);
  protected readonly productos = signal<Producto[]>([]);
  protected readonly cargando = signal(false);
  protected readonly llamada = signal<Llamada | null>(null);
  private readonly formato = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' });

  constructor() {
    this.cargar();
  }

  protected clp(valor: number): string {
    return this.formato.format(valor);
  }

  protected cargar(): void {
    this.cargando.set(true);
    this.servicio.listar().subscribe({
      next: (data) => {
        this.productos.set(data);
        this.cargando.set(false);
        this.llamada.set(llamadaOk('GET', this.servicio.ruta, 200, `${data.length} producto(s) recibidos`));
      },
      error: (e) => {
        this.productos.set([]);
        this.cargando.set(false);
        this.llamada.set(llamadaError('GET', this.servicio.ruta, e));
      },
    });
  }
}
