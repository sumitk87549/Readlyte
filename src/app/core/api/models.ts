export interface AuthResponse {
  userId: number;
  name: string;
  phone: string;
  token: string;
}

export interface AdminAuthResponse {
  token: string;
}

export interface BookDto {
  id: number;
  title: string;
  author?: string | null;
  description?: string | null;
  language?: string | null;
  coverUrl?: string | null;
  bookUrl?: string | null;
  bookAudioUrl?: string | null;
  summaryText?: string | null;
  translationText?: string | null;
  summaryAudioUrl?: string | null;
  translationAudioUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface BookListItemDto {
  id: number;
  title: string;
  author?: string | null;
  description?: string | null;
  language?: string | null;
  coverUrl?: string | null;
  hasSummary: boolean;
  hasTranslation: boolean;
  hasBookAudio: boolean;
  hasSummaryAudio: boolean;
  hasTranslationAudio: boolean;
  excerpt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export type ContentType = 'BOOK_AUDIO' | 'SUMMARY_AUDIO' | 'TRANSLATION_AUDIO';

export interface ProgressResponse {
  bookId: number;
  contentType: ContentType;
  positionMillis: number;
  updatedAt?: string | null;
}

export interface UpsertProgressRequest {
  bookId: number;
  contentType: ContentType;
  positionMillis: number;
}
