import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ToastService } from './toast.service';

@Component({
  selector: 'app-toast-host',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-host" aria-live="polite" aria-atomic="true">
      <div
        *ngFor="let t of toastService.toasts()"
        class="toast"
        [class.success]="t.type === 'success'"
        [class.error]="t.type === 'error'"
        [class.info]="t.type === 'info'"
        (click)="toastService.dismiss(t.id)"
      >
        {{ t.message }}
      </div>
    </div>
  `,
  styles: [
    `
      .toast-host {
        position: fixed;
        right: 14px;
        top: 14px;
        z-index: 50;
        display: grid;
        gap: 10px;
        width: min(420px, calc(100vw - 28px));
      }
      .toast {
        cursor: pointer;
        padding: 12px 14px;
        border-radius: 14px;
        border: 1px solid rgba(255, 255, 255, 0.14);
        background: rgba(0, 0, 0, 0.55);
        backdrop-filter: blur(10px);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
        color: rgba(255, 255, 255, 0.92);
        animation: in 160ms ease-out;
      }
      .toast.success {
        border-color: rgba(34, 197, 94, 0.4);
      }
      .toast.error {
        border-color: rgba(239, 68, 68, 0.45);
      }
      .toast.info {
        border-color: rgba(59, 130, 246, 0.45);
      }
      @keyframes in {
        from {
          transform: translateY(-6px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }
    `
  ]
})
export class ToastHostComponent {
  toastService = inject(ToastService);
}
