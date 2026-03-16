import { Routes } from '@angular/router';
import { CvView } from './components/cv-view/cv-view';
import { AdminEditor } from './components/admin-editor/admin-editor';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { CvDashboard } from './components/cv-dashboard/cv-dashboard';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: Login },
    { path: 'register', component: Register },
    { path: 'dashboard', component: CvDashboard, canActivate: [authGuard] },
    { path: 'admin/:cvId', component: AdminEditor, canActivate: [authGuard] },
    { path: ':username', component: CvView },
    { path: ':username/:cvId', component: CvView },
    { path: '**', redirectTo: 'login' }
];
