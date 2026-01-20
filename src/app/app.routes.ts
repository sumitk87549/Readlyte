import { Routes } from '@angular/router';
import { adminGuard } from './core/auth/guards';
import { ShellComponent } from './layout/shell.component';
import { AdminDashboardPageComponent } from './pages/admin/admin-dashboard-page.component';
import { AdminLoginPageComponent } from './pages/admin/admin-login-page.component';
import { BookDetailPageComponent } from './pages/books/book-detail-page.component';
import { BooksPageComponent } from './pages/books/books-page.component';
import { LandingPageComponent } from './pages/landing/landing-page.component';
import { SignInPageComponent } from './pages/auth/signin-page.component';
import { SignUpPageComponent } from './pages/auth/signup-page.component';

export const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      { path: '', component: LandingPageComponent },
      { path: 'signup', component: SignUpPageComponent },
      { path: 'signin', component: SignInPageComponent },
      { path: 'books', component: BooksPageComponent },
      { path: 'books/:id', component: BookDetailPageComponent },
      { path: 'admin/login', component: AdminLoginPageComponent },
      { path: 'admin', canActivate: [adminGuard], component: AdminDashboardPageComponent },
      { path: '**', redirectTo: '' }
    ]
  }
];
