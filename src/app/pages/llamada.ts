import { HttpErrorResponse } from '@angular/common/http';

/** Resultado de la última llamada HTTP, para mostrarlo en pantalla (útil como evidencia en la demo). */
export interface Llamada {
  metodo: string;
  ruta: string;
  estado: number;
  ok: boolean;
  mensaje: string;
}

export function llamadaOk(metodo: string, ruta: string, estado: number, mensaje: string): Llamada {
  return { metodo, ruta, estado, ok: true, mensaje };
}

export function llamadaError(metodo: string, ruta: string, e: unknown): Llamada {
  if (e instanceof HttpErrorResponse) {
    const cuerpo = e.error as { message?: string } | null;
    return { metodo, ruta, estado: e.status, ok: false, mensaje: cuerpo?.message ?? e.statusText ?? 'Error' };
  }
  return { metodo, ruta, estado: 0, ok: false, mensaje: 'No se pudo conectar con el servidor' };
}
