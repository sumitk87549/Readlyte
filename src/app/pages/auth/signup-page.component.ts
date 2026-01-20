import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-signup-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="card" style="max-width: 520px; margin: 0 auto">
      <h2>Create your account</h2>
      <p class="muted">Register with name, phone and password.</p>

      <form [formGroup]="form" (ngSubmit)="submit()" class="form">
        <div class="field">
          <label>Name</label>
          <input formControlName="name" placeholder="Your name" />
        </div>

        <div class="field">
          <label>Phone number</label>
          <input formControlName="phone" placeholder="10-digit phone" inputmode="numeric" />
        </div>

        <div class="field">
          <label>Password</label>
          <input type="password" formControlName="password" placeholder="Password" />
        </div>

        <div class="row" style="margin-top: 10px">
          <button class="btn primary" type="submit" [disabled]="form.invalid || loading">{{ loading ? 'Creating...' : 'Sign up' }}</button>
          <button class="btn" type="button" (click)="goSignin()">I already have an account</button>
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
export class SignUpPageComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  loading = false;
  error: string | null = null;

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
    password: ['', [Validators.required, Validators.minLength(4)]]
  });

  submit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = null;

    const payload = {
      name: this.form.value.name!,
      phone: this.form.value.phone!,
      password: this.form.value.password!
    };

    this.auth.register(payload).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigateByUrl('/books');
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message ?? 'Registration failed';
      }
    });
  }

  goSignin(): void {
    this.router.navigateByUrl('/signin');
  }
}
