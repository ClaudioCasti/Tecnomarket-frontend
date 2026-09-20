import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Pedido } from '../core/models';
import { PedidosService } from '../core/pedidos.service';
import { Llamada, llamadaError, llamadaOk } from './llamada';

@Component({
  selector: 'app-pedidos',
  imports: [DatePipe],
  template: `
    <h1>Pedidos</h1>

    <div class="card">
      <div class="row">
        <h2>Listado</h2>
        <button class="btn ghost" (click)="cargar()" [disabled]="cargando()">Actualizar</button>
      </div>
      @if (cargando()) {
        <p class="muted">Cargando…</p>
      } @else if (pedidos().length === 0) {
        <p class="muted">No hay pedidos para mostrar.</p>
      } @else {
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Estado</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              @for (p of pedidos(); track p.id) {
                <tr>
                  <td>{{ p.id }}</td>
                  <td>{{ p.producto }}</td>
                  <td>{{ p.cantidad }}</td>
                  <td>
                    <span class="badge">{{ p.estado }}</span>
                  </td>
                  <td>{{ p.fecha | date: 'dd-MM-yyyy HH:mm' }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>

    <div class="card">
      <h2>Crear pedido</h2>
      <p class="muted">
        Crear pedidos requiere el scope <code>rs-api-pedidos/pedidos-write</code>. Este front solo solicita
        permisos de lectura, por lo que el API Gateway debe responder <strong>403</strong>.
      </p>
      <div class="form-row">
        <input #producto placeholder="Producto" value="Notebook" />
        <input #cantidad type="number" min="1" value="1" />
        <button class="btn" (click)="crear(producto.value, +cantidad.value)">Crear pedido</button>
      </div>
    </div>

    @if (llamada(); as l) {
      <div class="panel" [class.ok]="l.ok" [class.fail]="!l.ok">
        <span class="method">{{ l.metodo }}</span> {{ l.ruta }} →
        <strong>{{ l.estado === 0 ? 'sin respuesta' : l.estado }}</strong> · {{ l.mensaje }}
      </div>
    }
  `,
})
export class PedidosPage {
  private readonly servicio = inject(PedidosService);
  protected readonly pedidos = signal<Pedido[]>([]);
  protected readonly cargando = signal(false);
  protected readonly llamada = signal<Llamada | null>(null);

  constructor() {
    this.cargar();
  }

  protected cargar(): void {
    this.cargando.set(true);
    this.servicio.listar().subscribe({
      next: (data) => {
        this.pedidos.set(data);
        this.cargando.set(false);
        this.llamada.set(llamadaOk('GET', this.servicio.ruta, 200, `${data.length} pedido(s) recibidos`));
      },
      error: (e) => {
        this.pedidos.set([]);
        this.cargando.set(false);
        this.llamada.set(llamadaError('GET', this.servicio.ruta, e));
      },
    });
  }

  protected crear(producto: string, cantidad: number): void {
    this.servicio.crear(producto, cantidad).subscribe({
      next: (p) => {
        this.llamada.set(llamadaOk('POST', this.servicio.ruta, 201, `Pedido #${p.id} creado`));
        this.cargar();
      },
      error: (e) => this.llamada.set(llamadaError('POST', this.servicio.ruta, e)),
    });
  }
}
