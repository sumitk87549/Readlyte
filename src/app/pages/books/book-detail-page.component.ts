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
    <a class="btn" routerLink="/books">Back to library</a>

    <div *ngIf="loading()" class="card" style="margin-top: 14px">Loading book...</div>

    <div *ngIf="error()" class="card" style="margin-top: 14px; border-color: rgba(239,68,68,.5)">
      {{ error() }}
    </div>

    <div class="card hero" style="margin-top: 14px" *ngIf="book() as b">
      <div class="row" style="gap: 16px; align-items: flex-start">
        <div class="cover" *ngIf="b.coverUrl">
          <img [src]="apiUrl(b.coverUrl)" alt="cover" />
        </div>
        <div class="hero-meta">
          <h2 style="margin: 0">{{ b.title }}</h2>
          <div class="muted" *ngIf="b.author">{{ b.author }}</div>

          <div class="row" style="margin-top: 10px; align-items: center">
            <span class="badge brand" *ngIf="b.language">{{ b.language }}</span>
            <span class="badge good" *ngIf="b.summaryText">Summary</span>
            <span class="badge good" *ngIf="b.translationText">Translation</span>
            <span class="badge brand" *ngIf="b.bookAudioUrl">Book audio</span>
            <span class="badge brand" *ngIf="b.summaryAudioUrl">Summary audio</span>
            <span class="badge brand" *ngIf="b.translationAudioUrl">Translation audio</span>
          </div>

          <p class="muted" *ngIf="b.description" style="margin-top: 10px">{{ b.description }}</p>

          <div class="row" style="margin-top: 12px">
            <a class="btn" *ngIf="b.bookUrl" [href]="apiUrl(b.bookUrl)" target="_blank" rel="noopener">Open book file</a>
            <button class="btn" type="button" (click)="setTab('summary')">Read summary</button>
            <button class="btn" type="button" (click)="setTab('audio')">Listen</button>
          </div>
        </div>
      </div>
    </div>

    <div class="tabs" style="margin-top: 12px" *ngIf="book() as b">
      <button class="tab" type="button" [class.active]="tab() === 'summary'" (click)="setTab('summary')">Summary</button>
      <button class="tab" type="button" [class.active]="tab() === 'translation'" (click)="setTab('translation')">Translation</button>
      <button class="tab" type="button" [class.active]="tab() === 'audio'" (click)="setTab('audio')">Audio</button>
      <button class="tab" type="button" [class.active]="tab() === 'book'" (click)="setTab('book')">Book file</button>
    </div>

    <div style="margin-top: 12px" *ngIf="book() as b">
      <div class="card" *ngIf="tab() === 'summary'">
        <div class="row" style="justify-content: space-between; align-items: center">
          <div style="font-weight: 700">Summary</div>
          <div class="row" style="align-items: center">
            <span class="badge">Font: {{ fontSize() }}px</span>
            <button class="btn" type="button" (click)="decFont()">A-</button>
            <button class="btn" type="button" (click)="incFont()">A+</button>
            <button class="btn" type="button" (click)="toggleComfort()">{{ comfort() ? 'Wide' : 'Comfort' }}</button>
          </div>
        </div>

        <div class="reading-wrap" [class.comfort]="comfort()" style="margin-top: 12px">
          <div class="reading" [style.fontSize.px]="fontSize()" *ngIf="b.summaryText; else noSummary">{{ b.summaryText }}</div>
          <ng-template #noSummary><div class="muted">No summary uploaded.</div></ng-template>
        </div>
      </div>

      <div class="card" *ngIf="tab() === 'translation'">
        <div class="row" style="justify-content: space-between; align-items: center">
          <div style="font-weight: 700">Translation</div>
          <div class="row" style="align-items: center">
            <span class="badge">Font: {{ fontSize() }}px</span>
            <button class="btn" type="button" (click)="decFont()">A-</button>
            <button class="btn" type="button" (click)="incFont()">A+</button>
            <button class="btn" type="button" (click)="toggleComfort()">{{ comfort() ? 'Wide' : 'Comfort' }}</button>
          </div>
        </div>

        <div class="reading-wrap" [class.comfort]="comfort()" style="margin-top: 12px">
          <div class="reading" [style.fontSize.px]="fontSize()" *ngIf="b.translationText; else noTrans">{{ b.translationText }}</div>
          <ng-template #noTrans><div class="muted">No translation uploaded.</div></ng-template>
        </div>
      </div>

      <div class="grid" *ngIf="tab() === 'audio'">
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

        <div class="card" *ngIf="!b.bookAudioUrl && !b.summaryAudioUrl && !b.translationAudioUrl">
          <div class="muted">No audio uploaded for this book yet.</div>
        </div>
      </div>

      <div class="card" *ngIf="tab() === 'book'">
        <div class="row" style="justify-content: space-between; align-items: center">
          <div style="font-weight: 700">Book file</div>
          <a class="btn" *ngIf="b.bookUrl" [href]="apiUrl(b.bookUrl)" target="_blank" rel="noopener">Open file</a>
        </div>

        <div class="muted" style="margin-top: 10px" *ngIf="!b.bookUrl">No book file uploaded.</div>
        <div class="muted" style="margin-top: 10px" *ngIf="b.bookUrl">Tip: open in a new tab for the best reading experience.</div>
      </div>
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

      .hero-meta {
        flex: 1;
        min-width: 260px;
      }

      .tabs {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
      }

      .tab {
        border: 1px solid rgba(255, 255, 255, 0.14);
        background: rgba(255, 255, 255, 0.06);
        color: rgba(255, 255, 255, 0.9);
        padding: 10px 12px;
        border-radius: 999px;
        cursor: pointer;
      }

      .tab.active {
        border-color: rgba(59, 130, 246, 0.5);
        background: rgba(59, 130, 246, 0.18);
      }

      .grid {
        display: grid;
        gap: 12px;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        margin-top: 12px;
      }

      .reading-wrap {
        width: 100%;
        max-width: 980px;
        margin: 0 auto;
      }

      .reading-wrap.comfort {
        max-width: 760px;
      }

      .reading {
        white-space: pre-wrap;
        line-height: 1.8;
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

  tab = signal<'summary' | 'translation' | 'audio' | 'book'>('summary');
  fontSize = signal(16);
  comfort = signal(true);

  apiUrl = apiUrl;

  bookId = computed(() => {
    const raw = this.route.snapshot.paramMap.get('id');
    return raw ? Number(raw) : 0;
  });

  setTab(t: 'summary' | 'translation' | 'audio' | 'book'): void {
    this.tab.set(t);
  }

  incFont(): void {
    this.fontSize.set(Math.min(22, this.fontSize() + 1));
  }

  decFont(): void {
    this.fontSize.set(Math.max(13, this.fontSize() - 1));
  }

  toggleComfort(): void {
    this.comfort.set(!this.comfort());
  }

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
