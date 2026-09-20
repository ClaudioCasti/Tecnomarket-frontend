export interface Pedido {
  id: number;
  estado: string;
  producto: string;
  cantidad: number;
  clienteSub: string;
  fecha: string;
}

export interface Producto {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
}
