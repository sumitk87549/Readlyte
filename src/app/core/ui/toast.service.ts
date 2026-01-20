import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts = signal<Toast[]>([]);

  success(message: string): void {
    this.show('success', message);
  }

  error(message: string): void {
    this.show('error', message);
  }

  info(message: string): void {
    this.show('info', message);
  }

  dismiss(id: string): void {
    this.toasts.set(this.toasts().filter((t) => t.id !== id));
  }

  private show(type: ToastType, message: string): void {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const toast: Toast = { id, type, message };
    this.toasts.set([toast, ...this.toasts()].slice(0, 4));

    setTimeout(() => this.dismiss(id), 3500);
  }
}
