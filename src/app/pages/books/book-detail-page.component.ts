import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { apiUrl } from '../../core/api/api-base';
import { BookService } from '../../core/api/book.service';
import { BookDto } from '../../core/api/models';
import { AudioPlayerComponent } from '../../components/audio-player.component';

@Component({
  selector: 'app-book-detail-page',
  standalone: true,
  imports: [CommonModule, RouterLink, AudioPlayerComponent],
  template: `
    <a class="btn" routerLink="/books">Back</a>

    <div *ngIf="loading()" class="card" style="margin-top: 14px">Loading book...</div>

    <div *ngIf="error()" class="card" style="margin-top: 14px; border-color: rgba(239,68,68,.5)">
      {{ error() }}
    </div>

    <div class="card" style="margin-top: 14px" *ngIf="book() as b">
      <div class="row" style="gap: 16px">
        <div class="cover" *ngIf="b.coverUrl">
          <img [src]="apiUrl(b.coverUrl)" alt="cover" />
        </div>
        <div style="flex: 1">
          <h2 style="margin: 0">{{ b.title }}</h2>
          <div class="muted" *ngIf="b.author">{{ b.author }}</div>
          <div class="muted" *ngIf="b.language">Language: {{ b.language }}</div>

          <p class="muted" *ngIf="b.description" style="margin-top: 10px">{{ b.description }}</p>

          <div class="row" style="margin-top: 12px">
            <a class="btn" *ngIf="b.bookUrl" [href]="apiUrl(b.bookUrl)" target="_blank" rel="noopener">Open book file</a>
          </div>
        </div>
      </div>
    </div>

    <div class="grid" style="margin-top: 14px" *ngIf="book() as b">
      <div class="card">
        <h3 style="margin-top: 0">Summary</h3>
        <div class="reading" *ngIf="b.summaryText; else noSummary">{{ b.summaryText }}</div>
        <ng-template #noSummary><div class="muted">No summary uploaded.</div></ng-template>
      </div>

      <div class="card">
        <h3 style="margin-top: 0">Translation</h3>
        <div class="reading" *ngIf="b.translationText; else noTrans">{{ b.translationText }}</div>
        <ng-template #noTrans><div class="muted">No translation uploaded.</div></ng-template>
      </div>
    </div>

    <div class="grid" style="margin-top: 14px" *ngIf="book() as b">
      <app-audio-player
        *ngIf="b.bookAudioUrl"
        [bookId]="b.id"
        contentType="BOOK_AUDIO"
        title="Book audio"
        [srcUrl]="b.bookAudioUrl"
      />

      <app-audio-player
        *ngIf="b.summaryAudioUrl"
        [bookId]="b.id"
        contentType="SUMMARY_AUDIO"
        title="Summary audio"
        [srcUrl]="b.summaryAudioUrl"
      />

      <app-audio-player
        *ngIf="b.translationAudioUrl"
        [bookId]="b.id"
        contentType="TRANSLATION_AUDIO"
        title="Translation audio"
        [srcUrl]="b.translationAudioUrl"
      />
    </div>
  `,
  styles: [
    `
      .cover {
        width: 120px;
        aspect-ratio: 3/4;
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
      .grid {
        display: grid;
        gap: 12px;
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
      .reading {
        white-space: pre-wrap;
        line-height: 1.6;
        font-size: 15px;
        color: rgba(255, 255, 255, 0.92);
      }
      @media (max-width: 760px) {
        .grid {
          grid-template-columns: 1fr;
        }
      }
    `
  ]
})
export class BookDetailPageComponent {
  private route = inject(ActivatedRoute);
  private booksApi = inject(BookService);

  loading = signal(false);
  error = signal<string | null>(null);
  book = signal<BookDto | null>(null);

  apiUrl = apiUrl;

  bookId = computed(() => {
    const raw = this.route.snapshot.paramMap.get('id');
    return raw ? Number(raw) : 0;
  });

  constructor() {
    const id = this.bookId();
    if (!id) {
      this.error.set('Invalid book id');
      return;
    }

    this.loading.set(true);
    this.booksApi.getBook(id).subscribe({
      next: (res) => {
        this.book.set(res);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load book.');
        this.loading.set(false);
      }
    });
  }
}
