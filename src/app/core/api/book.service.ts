import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from './api-base';
import { BookDto, BookListItemDto } from './models';

@Injectable({ providedIn: 'root' })
export class BookService {
  constructor(private http: HttpClient) {}

  listBooks(): Observable<BookListItemDto[]> {
    return this.http.get<BookListItemDto[]>(`${API_BASE_URL}/api/books`);
  }

  getBook(id: number): Observable<BookDto> {
    return this.http.get<BookDto>(`${API_BASE_URL}/api/books/${id}`);
  }

  createBook(formData: FormData): Observable<BookDto> {
    return this.http.post<BookDto>(`${API_BASE_URL}/api/admin/books`, formData);
  }
}
