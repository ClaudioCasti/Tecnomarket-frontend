import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { Producto } from './models';

@Injectable({ providedIn: 'root' })
export class ProductosService {
  private readonly http = inject(HttpClient);
  readonly ruta = '/api/productos';
  private readonly url = `${environment.apiUrl}${this.ruta}`;

  listar() {
    return this.http.get<Producto[]>(this.url);
  }
}
