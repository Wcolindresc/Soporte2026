import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, RouterOutlet, Routes } from '@angular/router';
import { Component } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './app/core/interceptors/auth.interceptor';
import { permissionGuard } from './app/core/guards/permission.guard';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`
})
class AppComponent {}

@Component({
  standalone: true,
  template: `
  <div class="container">
    <h1>Sistema Soporte2026</h1>
    <p>Moneda: Q (Quetzales)</p>
    <ul>
      <li *ngFor="let p of pages">{{p}}</li>
    </ul>
  </div>`
})
class DashboardComponent { pages = ['Seguridad','Dashboard','Catálogos','Inventario','Reportes','Cotizaciones']; }

const routes: Routes = [
  { path: '', component: DashboardComponent, canActivate: [permissionGuard], data: { permission: 'dashboard.view' } },
  { path: '**', redirectTo: '' }
];

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes), provideHttpClient(withInterceptors([authInterceptor]))]
});
