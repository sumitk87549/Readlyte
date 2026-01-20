import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-admin-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="card" style="max-width: 560px; margin: 0 auto">
      <h2>Admin login</h2>
      <p class="muted">Use admin phone/password to access uploads.</p>

      <form [formGroup]="form" (ngSubmit)="submit()" class="form">
        <div class="field">
          <label>Phone number</label>
          <input formControlName="phone" inputmode="numeric" />
        </div>

        <div class="field">
          <label>Password</label>
          <input type="password" formControlName="password" />
        </div>

        <div class="row" style="margin-top: 10px">
          <button class="btn primary" type="submit" [disabled]="form.invalid || loading">{{ loading ? 'Signing in...' : 'Login' }}</button>
        </div>

        <div *ngIf="error" class="card" style="margin-top: 12px; border-color: rgba(239,68,68,.5)">
          {{ error }}
        </div>

        <div class="card" style="margin-top: 12px">
          <div class="muted">Default admin creds:</div>
          <div>Phone: 7976611437</div>
          <div>Password: 875421</div>
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
export class AdminLoginPageComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  loading = false;
  error: string | null = null;

  form = this.fb.group({
    phone: ['7976611437', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
    password: ['875421', [Validators.required]]
  });

  submit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = null;

    this.auth.adminLogin({ phone: this.form.value.phone!, password: this.form.value.password! }).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigateByUrl('/admin');
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message ?? 'Admin login failed';
      }
    });
  }
}
