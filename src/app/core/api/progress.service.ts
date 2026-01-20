import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from './api-base';
import { ContentType, ProgressResponse, UpsertProgressRequest } from './models';

@Injectable({ providedIn: 'root' })
export class ProgressService {
  constructor(private http: HttpClient) {}

  getProgress(bookId: number, contentType: ContentType, userHeaders: HttpHeaders): Observable<ProgressResponse> {
    const url = `${API_BASE_URL}/api/progress?bookId=${bookId}&contentType=${contentType}`;
    return this.http.get<ProgressResponse>(url, { headers: userHeaders });
  }

  upsert(request: UpsertProgressRequest, userHeaders: HttpHeaders): Observable<ProgressResponse> {
    return this.http.put<ProgressResponse>(`${API_BASE_URL}/api/progress`, request, { headers: userHeaders });
  }
}
