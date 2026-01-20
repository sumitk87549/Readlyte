import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-signin-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="card" style="max-width: 520px; margin: 0 auto">
      <h2>Sign in</h2>
      <p class="muted">Login with phone number and password.</p>

      <form [formGroup]="form" (ngSubmit)="submit()" class="form">
        <div class="field">
          <label>Phone number</label>
          <input formControlName="phone" placeholder="10-digit phone" inputmode="numeric" />
        </div>

        <div class="field">
          <label>Password</label>
          <input type="password" formControlName="password" placeholder="Password" />
        </div>

        <div class="row" style="margin-top: 10px">
          <button class="btn primary" type="submit" [disabled]="form.invalid || loading">{{ loading ? 'Signing in...' : 'Sign in' }}</button>
          <button class="btn" type="button" (click)="goSignup()">Create account</button>
        </div>

        <div *ngIf="error" class="card" style="margin-top: 12px; border-color: rgba(239,68,68,.5)">
          {{ error }}
        </div>
      </form>
    </div>
  `,
  styles: [
    `
      .form {
        display: grid;
        gap: 12px;
      }
    `
  ]
})
export class SignInPageComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  loading = false;
  error: string | null = null;

  form = this.fb.group({
    phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
    password: ['', [Validators.required]]
  });

  submit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = null;

    this.auth.login({ phone: this.form.value.phone!, password: this.form.value.password! }).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigateByUrl('/books');
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message ?? 'Login failed';
      }
    });
  }

  goSignup(): void {
    this.router.navigateByUrl('/signup');
  }
}
