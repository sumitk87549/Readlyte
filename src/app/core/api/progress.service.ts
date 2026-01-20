import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from './api-base';
import { ContentType, ProgressResponse, UpsertProgressRequest } from './models';

@Injectable({ providedIn: 'root' })
export class ProgressService {
  constructor(private http: HttpClient) {}

  getProgress(bookId: number, contentType: ContentType): Observable<ProgressResponse> {
    const url = `${API_BASE_URL}/api/progress?bookId=${bookId}&contentType=${contentType}`;
    return this.http.get<ProgressResponse>(url);
  }

  upsert(request: UpsertProgressRequest): Observable<ProgressResponse> {
    return this.http.put<ProgressResponse>(`${API_BASE_URL}/api/progress`, request);
  }
}
