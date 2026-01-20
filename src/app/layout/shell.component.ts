import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../core/auth/auth.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <header class="header">
      <div class="container header-inner">
        <a class="brand" routerLink="/">
          <div class="logo">R</div>
          <div>
            <div class="brand-title">Readlyte</div>
            <div class="brand-sub">Summaries · Translations · Audio</div>
          </div>
        </a>

        <nav class="nav">
          <a routerLink="/books" routerLinkActive="active">Books</a>
          <a routerLink="/" fragment="about" routerLinkActive="active">About</a>
          <a routerLink="/" fragment="contact" routerLinkActive="active">Contact</a>
        </nav>

        <div class="actions">
          <ng-container *ngIf="isLoggedIn(); else guest">
            <div class="user">{{ userName() }}</div>
            <button class="btn" (click)="logoutUser()">Logout</button>
          </ng-container>
          <ng-template #guest>
            <a class="btn" routerLink="/signin">Sign in</a>
            <a class="btn primary" routerLink="/signup">Sign up</a>
          </ng-template>

          <a class="btn" routerLink="/admin" *ngIf="isAdminLoggedIn()">Admin</a>
          <a class="btn" routerLink="/admin/login" *ngIf="!isAdminLoggedIn()">Admin Login</a>
        </div>
      </div>
    </header>

    <main class="container" style="padding-top: 18px">
      <router-outlet />
    </main>

    <footer class="footer">
      <div class="container muted">© {{ year }} Readlyte</div>
    </footer>
  `,
  styles: [
    `
      .header {
        position: sticky;
        top: 0;
        z-index: 10;
        background: rgba(11, 15, 23, 0.85);
        backdrop-filter: blur(10px);
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      }
      .header-inner {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
      }
      .brand {
        display: flex;
        gap: 10px;
        align-items: center;
        text-decoration: none;
      }
      .logo {
        width: 34px;
        height: 34px;
        border-radius: 10px;
        background: #3b82f6;
        display: grid;
        place-items: center;
        font-weight: 700;
      }
      .brand-title {
        font-weight: 700;
        letter-spacing: 0.2px;
      }
      .brand-sub {
        font-size: 12px;
        opacity: 0.75;
      }
      .nav {
        display: flex;
        gap: 12px;
      }
      .nav a {
        text-decoration: none;
        opacity: 0.85;
        padding: 10px 10px;
        border-radius: 10px;
      }
      .nav a.active {
        background: rgba(255, 255, 255, 0.06);
        opacity: 1;
      }
      .actions {
        display: flex;
        gap: 10px;
        align-items: center;
      }
      .user {
        opacity: 0.9;
        font-size: 13px;
      }
      .footer {
        margin-top: 30px;
        padding: 20px 0;
        border-top: 1px solid rgba(255, 255, 255, 0.08);
      }
      @media (max-width: 760px) {
        .nav {
          display: none;
        }
      }
    `
  ]
})
export class ShellComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  year = new Date().getFullYear();

  isLoggedIn = computed(() => this.auth.isLoggedIn());
  isAdminLoggedIn = computed(() => this.auth.isAdminLoggedIn());
  userName = computed(() => this.auth.getUser()?.name ?? '');

  logoutUser(): void {
    this.auth.logoutUser();
    this.router.navigateByUrl('/');
  }
}
