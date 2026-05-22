import { Routes } from '@angular/router';
import { Dashboard } from './components/dashboard/dashboard';
import { ClientDetail } from './components/client-detail/client-detail';
import { LoginComponent } from './components/login/login';
import { authGuard } from './services/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: Dashboard, canActivate: [authGuard] },
  { path: 'client/:id', component: ClientDetail, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];
