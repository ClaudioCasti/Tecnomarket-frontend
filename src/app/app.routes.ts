import { Routes } from '@angular/router';
import { authGuard, roleGuard } from './core/auth.guard';
import { AdminPage } from './pages/admin';
import { HomePage } from './pages/home';
import { PedidosPage } from './pages/pedidos';
import { PerfilPage } from './pages/perfil';
import { ProductosPage } from './pages/productos';

export const routes: Routes = [
  { path: '', component: HomePage },
  { path: 'pedidos', component: PedidosPage, canActivate: [authGuard] },
  { path: 'productos', component: ProductosPage, canActivate: [authGuard] },
  { path: 'perfil', component: PerfilPage, canActivate: [authGuard] },
  { path: 'admin', component: AdminPage, canActivate: [roleGuard('admin')] },
  { path: '**', redirectTo: '' },
];
