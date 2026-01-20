import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild, inject } from '@angular/core';
import { apiUrl } from '../core/api/api-base';
import { ContentType } from '../core/api/models';
import { ProgressService } from '../core/api/progress.service';
import { AuthService } from '../core/auth/auth.service';

@Component({
  selector: 'app-audio-player',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card" *ngIf="srcUrl">
      <div class="row" style="justify-content: space-between; align-items: center">
        <div>
          <div style="font-weight: 700">{{ title }}</div>
          <div class="muted" style="font-size: 12px" *ngIf="resumeHint">{{ resumeHint }}</div>
        </div>

        <button class="btn" (click)="restart()" [disabled]="!canRestart">Restart</button>
      </div>

      <audio #audio controls [src]="fullSrc" (timeupdate)="onTimeUpdate()" (pause)="flush()" (ended)="flush()" style="width: 100%; margin-top: 10px"></audio>

      <div class="muted" style="margin-top: 10px" *ngIf="!isLoggedIn">
        Sign in to enable resume.
      </div>
    </div>
  `
})
export class AudioPlayerComponent implements AfterViewInit, OnDestroy {
  private progressApi = inject(ProgressService);
  private auth = inject(AuthService);

  @Input({ required: true }) bookId!: number;
  @Input({ required: true }) contentType!: ContentType;
  @Input() title = 'Audio';
  @Input() srcUrl: string | null = null;

  @ViewChild('audio') audioRef?: ElementRef<HTMLAudioElement>;

  fullSrc: string | null = null;
  isLoggedIn = false;
  resumeHint: string | null = null;
  canRestart = false;

  private lastSavedMs = 0;
  private timer: any;

  ngAfterViewInit(): void {
    this.fullSrc = apiUrl(this.srcUrl);
    this.isLoggedIn = this.auth.isLoggedIn();

    if (!this.isLoggedIn || !this.bookId || !this.contentType) {
      return;
    }

    const headers = this.auth.userAuthHeaders();
    this.progressApi.getProgress(this.bookId, this.contentType, headers).subscribe({
      next: (res) => {
        if (!this.audioRef?.nativeElement) return;
        const secs = Math.floor((res.positionMillis ?? 0) / 1000);
        if (secs > 0) {
          this.audioRef.nativeElement.currentTime = secs;
          this.resumeHint = `Resuming from ${formatTime(secs)}.`;
          this.canRestart = true;
        }
      }
    });

    this.timer = setInterval(() => this.flush(), 5000);
  }

  ngOnDestroy(): void {
    this.flush();
    if (this.timer) clearInterval(this.timer);
  }

  restart(): void {
    const audio = this.audioRef?.nativeElement;
    if (!audio) return;
    audio.currentTime = 0;
    this.resumeHint = 'Restarted.';
    this.flush(true);
  }

  onTimeUpdate(): void {
    const audio = this.audioRef?.nativeElement;
    if (!audio || !this.isLoggedIn) return;

    const posMs = Math.floor(audio.currentTime * 1000);
    if (posMs - this.lastSavedMs < 4000) return;
    this.lastSavedMs = posMs;
    this.flush();
  }

  flush(force?: boolean): void {
    const audio = this.audioRef?.nativeElement;
    if (!audio || !this.isLoggedIn) return;

    const posMs = Math.floor(audio.currentTime * 1000);
    if (!force && posMs <= 0) return;

    const headers = this.auth.userAuthHeaders();
    this.progressApi.upsert({ bookId: this.bookId, contentType: this.contentType, positionMillis: posMs }, headers).subscribe();
  }
}

function formatTime(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;

  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${m}:${String(s).padStart(2, '0')}`;
}
