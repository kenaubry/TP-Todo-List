import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';

import { RootComponent } from './app/root';
import { routes } from './app/app.routes';
import { AuthService } from './app/services/auth.service';

// ✅ Intercepteur inline (pas besoin de classe séparée si tu veux simplifier)
const jwtInterceptor = (req: any, next: any) => {
  const token = localStorage.getItem('token');
  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }
  return next(req);
};

bootstrapApplication(RootComponent, {
  providers: [
    provideRouter(routes),
    importProvidersFrom(HttpClientModule),
    provideHttpClient(withInterceptors([jwtInterceptor])) // ✅ ajoute l'intercepteur JWT
  ]
}).catch(err => console.error(err));
