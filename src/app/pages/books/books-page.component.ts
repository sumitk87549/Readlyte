import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { apiUrl } from '../../core/api/api-base';
import { BookService } from '../../core/api/book.service';
import { BookListItemDto } from '../../core/api/models';

type SortKey = 'title' | 'createdAt';

@Component({
  selector: 'app-books-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="row" style="justify-content: space-between; align-items: center">
      <div>
        <h2 style="margin: 0">Books</h2>
        <p class="muted" style="margin-top: 6px">Search and sort happens locally in the browser (MVP).</p>
      </div>

      <div class="row" style="align-items: center">
        <input style="min-width: 220px" [value]="query()" (input)="setQuery($any($event.target).value)" placeholder="Search by title/author..." />
        <select style="min-width: 140px" [value]="sortKey()" (change)="setSortKey($any($event.target).value)">
          <option value="title">Sort: Title</option>
          <option value="createdAt">Sort: Newest</option>
        </select>
      </div>
    </div>

    <div *ngIf="loading()" class="card" style="margin-top: 14px">Loading books...</div>

    <div *ngIf="error()" class="card" style="margin-top: 14px; border-color: rgba(239,68,68,.5)">
      {{ error() }}
    </div>

    <div class="grid" style="margin-top: 14px" *ngIf="!loading()">
      <a class="card hover book" *ngFor="let b of filteredBooks()" [routerLink]="['/books', b.id]">
        <div class="cover" *ngIf="b.coverUrl">
          <img [src]="apiUrl(b.coverUrl)" alt="cover" />
        </div>
        <div class="meta">
          <div class="title-row">
            <div class="title">{{ b.title }}</div>
            <span class="badge brand" *ngIf="b.language">{{ b.language }}</span>
          </div>
          <div class="muted" *ngIf="b.author">{{ b.author }}</div>

          <div class="badges">
            <span class="badge good" *ngIf="b.hasSummary">Summary</span>
            <span class="badge good" *ngIf="b.hasTranslation">Translation</span>
            <span class="badge brand" *ngIf="b.hasBookAudio">Book audio</span>
            <span class="badge brand" *ngIf="b.hasSummaryAudio">Summary audio</span>
            <span class="badge brand" *ngIf="b.hasTranslationAudio">Translation audio</span>
          </div>

          <div class="excerpt" *ngIf="b.excerpt">{{ b.excerpt }}</div>
        </div>
      </a>
    </div>

    <div *ngIf="!loading() && filteredBooks().length === 0" class="card" style="margin-top: 14px">
      No books found.
    </div>
  `,
  styles: [
    `
      .grid {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 12px;
      }
      .book {
        text-decoration: none;
        display: grid;
        gap: 12px;
      }
      .cover {
        width: 100%;
        aspect-ratio: 3 / 4;
        border-radius: 12px;
        overflow: hidden;
        background: rgba(255, 255, 255, 0.06);
      }
      .cover img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }
      .meta {
        display: grid;
        gap: 8px;
      }
      .title-row {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 10px;
      }
      .title {
        font-weight: 700;
      }
      .badges {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
        margin-top: 2px;
      }
      .excerpt {
        color: rgba(255, 255, 255, 0.78);
        font-size: 13px;
        line-height: 1.45;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      @media (max-width: 1000px) {
        .grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }
      @media (max-width: 520px) {
        .grid {
          grid-template-columns: 1fr;
        }
      }
    `
  ]
})
export class BooksPageComponent {
  private booksApi = inject(BookService);

  loading = signal(false);
  error = signal<string | null>(null);
  books = signal<BookListItemDto[]>([]);

  query = signal('');
  sortKey = signal<SortKey>('createdAt');

  apiUrl = apiUrl;

  filteredBooks = computed(() => {
    const q = this.query().trim().toLowerCase();
    const sortKey = this.sortKey();

    const filtered = this.books().filter((b) => {
      if (!q) return true;
      const title = (b.title ?? '').toLowerCase();
      const author = (b.author ?? '').toLowerCase();
      const excerpt = (b.excerpt ?? '').toLowerCase();
      return title.includes(q) || author.includes(q) || excerpt.includes(q);
    });

    const sorted = [...filtered].sort((a, b) => {
      if (sortKey === 'title') return (a.title ?? '').localeCompare(b.title ?? '');
      const at = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bt = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bt - at;
    });

    return sorted;
  });

  constructor() {
    this.loading.set(true);
    this.booksApi.listBooks().subscribe({
      next: (res) => {
        this.books.set(res);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load books. Is the backend running on :8085 ?');
        this.loading.set(false);
      }
    });
  }

  setQuery(v: string): void {
    this.query.set(v);
  }

  setSortKey(v: SortKey): void {
    this.sortKey.set(v);
  }
}
