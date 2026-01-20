import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { BookService } from '../../core/api/book.service';
import { BookDto } from '../../core/api/models';
import { AuthService } from '../../core/auth/auth.service';
import { ToastService } from '../../core/ui/toast.service';

@Component({
  selector: 'app-admin-dashboard-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="row" style="justify-content: space-between; align-items: center">
      <div>
        <h2 style="margin: 0">Admin dashboard</h2>
        <p class="muted" style="margin-top: 6px">Upload book assets (cover/book file/text/audio).</p>
      </div>

      <div class="row">
        <button class="btn danger" (click)="logout()">Logout</button>
      </div>
    </div>

    <div class="card" style="margin-top: 14px">
      <div class="grid">
        <div class="field">
          <label>Title *</label>
          <input [value]="title" (input)="title = $any($event.target).value" />
        </div>

        <div class="field">
          <label>Author</label>
          <input [value]="author" (input)="author = $any($event.target).value" />
        </div>

        <div class="field">
          <label>Language</label>
          <input [value]="language" (input)="language = $any($event.target).value" placeholder="e.g. English/Hindi" />
        </div>

        <div class="field" style="grid-column: 1 / -1">
          <label>Description</label>
          <textarea rows="3" [value]="description" (input)="description = $any($event.target).value"></textarea>
        </div>

        <div class="field" style="grid-column: 1 / -1">
          <label>Summary text</label>
          <textarea rows="6" [value]="summaryText" (input)="summaryText = $any($event.target).value"></textarea>
        </div>

        <div class="field" style="grid-column: 1 / -1">
          <label>Summary text file</label>
          <input type="file" (change)="summaryTextFile = pick($event)" />
        </div>

        <div class="field" style="grid-column: 1 / -1">
          <label>Translation text</label>
          <textarea rows="6" [value]="translationText" (input)="translationText = $any($event.target).value"></textarea>
        </div>

        <div class="field" style="grid-column: 1 / -1">
          <label>Translation text file</label>
          <input type="file" (change)="translationTextFile = pick($event)" />
        </div>

        <div class="field">
          <label>Cover image</label>
          <input type="file" accept="image/*" (change)="cover = pick($event)" />
        </div>

        <div class="field">
          <label>Book file (pdf/epub/txt)</label>
          <input type="file" (change)="bookFile = pick($event)" />
        </div>

        <div class="field">
          <label>Book audio</label>
          <input type="file" accept="audio/*" (change)="bookAudio = pick($event)" />
        </div>

        <div class="field">
          <label>Summary audio</label>
          <input type="file" accept="audio/*" (change)="summaryAudio = pick($event)" />
        </div>

        <div class="field">
          <label>Translation audio</label>
          <input type="file" accept="audio/*" (change)="translationAudio = pick($event)" />
        </div>
      </div>

      <div class="row" style="margin-top: 12px">
        <button class="btn primary" (click)="submit()" [disabled]="submitting()">{{ submitting() ? 'Uploading...' : 'Upload' }}</button>
      </div>

      <div *ngIf="error()" class="card" style="margin-top: 12px; border-color: rgba(239,68,68,.5)">
        {{ error() }}
      </div>

      <div *ngIf="createdBook() as b" class="card" style="margin-top: 12px">
        <div style="font-weight: 700">Uploaded: {{ b.title }}</div>
        <div class="muted">Book id: {{ b.id }}</div>
      </div>
    </div>
  `,
  styles: [
    `
      .grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 12px;
      }
      @media (max-width: 760px) {
        .grid {
          grid-template-columns: 1fr;
        }
      }
    `
  ]
})
export class AdminDashboardPageComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private booksApi = inject(BookService);
  private toast = inject(ToastService);

  title = '';
  author = '';
  language = '';
  description = '';
  summaryText = '';
  translationText = '';

  summaryTextFile: File | null = null;
  translationTextFile: File | null = null;

  cover: File | null = null;
  bookFile: File | null = null;
  bookAudio: File | null = null;
  summaryAudio: File | null = null;
  translationAudio: File | null = null;

  submitting = signal(false);
  error = signal<string | null>(null);
  createdBook = signal<BookDto | null>(null);

  pick(evt: Event): File | null {
    const input = evt.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return null;
    return input.files.item(0);
  }

  hasTextFiles(): boolean {
    return !!(this.summaryTextFile || this.translationTextFile);
  }

  submit(): void {
    this.error.set(null);
    this.createdBook.set(null);

    if (!this.title.trim()) {
      this.error.set('Title is required');
      return;
    }

    const fd = new FormData();
    fd.append('title', this.title.trim());
    if (this.author.trim()) fd.append('author', this.author.trim());
    if (this.description.trim()) fd.append('description', this.description.trim());
    if (this.language.trim()) fd.append('language', this.language.trim());
    if (this.summaryText.trim()) fd.append('summaryText', this.summaryText);
    if (this.translationText.trim()) fd.append('translationText', this.translationText);

    if (this.summaryTextFile) fd.append('summaryTextFile', this.summaryTextFile);
    if (this.translationTextFile) fd.append('translationTextFile', this.translationTextFile);

    if (this.cover) fd.append('cover', this.cover);
    if (this.bookFile) fd.append('bookFile', this.bookFile);
    if (this.bookAudio) fd.append('bookAudio', this.bookAudio);
    if (this.summaryAudio) fd.append('summaryAudio', this.summaryAudio);
    if (this.translationAudio) fd.append('translationAudio', this.translationAudio);

    this.submitting.set(true);

    this.booksApi.createBook(fd).subscribe({
      next: (res) => {
        this.createdBook.set(res);
        this.submitting.set(false);
        this.toast.success('Book uploaded successfully');
      },
      error: (err) => {
        this.error.set(err?.error?.message ?? 'Upload failed');
        this.submitting.set(false);
        this.toast.error(this.error() ?? 'Upload failed');
      }
    });
  }

  logout(): void {
    this.auth.logoutAdmin();
    this.router.navigateByUrl('/admin/login');
  }
}
