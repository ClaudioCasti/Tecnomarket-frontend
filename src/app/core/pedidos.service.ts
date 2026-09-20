import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { Pedido } from './models';

@Injectable({ providedIn: 'root' })
export class PedidosService {
  private readonly http = inject(HttpClient);
  readonly ruta = '/api/pedidos';
  private readonly url = `${environment.apiUrl}${this.ruta}`;

  listar() {
    return this.http.get<Pedido[]>(this.url);
  }

  crear(producto: string, cantidad: number) {
    return this.http.post<Pedido>(this.url, { producto, cantidad });
  }
}
