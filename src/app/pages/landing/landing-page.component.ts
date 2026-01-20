import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="hero card">
      <div>
        <h1 class="title">Make books simple to read, understand, and finish.</h1>
        <p class="subtitle muted">
          Readlyte helps you consume a book through a summary, translation, and audio — with resume support.
        </p>

        <div class="row" style="margin-top: 14px">
          <a class="btn primary" routerLink="/books">Browse Books</a>
          <a class="btn" routerLink="/signup" *ngIf="!isLoggedIn()">Create account</a>
          <a class="btn" routerLink="/signin" *ngIf="!isLoggedIn()">Sign in</a>
        </div>

        <div class="row" style="margin-top: 12px">
          <a class="btn" routerLink="/admin/login">Admin</a>
        </div>
      </div>
    </section>

    <div class="grid" style="margin-top: 16px">
      <section class="card" id="about">
        <h2>About us</h2>
        <p class="muted">
          This MVP is designed for fast feedback: upload your local book assets (cover, book file, audio, summary, translation)
          and let users read or listen on desktop/mobile.
        </p>
      </section>

      <section class="card" id="contact">
        <h2>Contact</h2>
        <p class="muted">Email: sumitk87549&#64;gmail.com</p>
        <p class="muted">Share feedback after listening/reading — it helps improve the experience.</p>
      </section>
    </div>
  `,
  styles: [
    `
      .hero {
        padding: 24px;
      }
      .title {
        margin: 0;
        font-size: 34px;
        line-height: 1.1;
      }
      .subtitle {
        margin-top: 10px;
        max-width: 820px;
      }
      .grid {
        display: grid;
        gap: 14px;
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
      @media (max-width: 760px) {
        .grid {
          grid-template-columns: 1fr;
        }
      }
    `
  ]
})
export class LandingPageComponent {
  private auth = inject(AuthService);
  isLoggedIn = computed(() => this.auth.isLoggedIn());
}
