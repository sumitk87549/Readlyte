import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { API_BASE_URL } from '../api/api-base';
import { AdminAuthResponse, AuthResponse } from '../api/models';

type StoredUser = Pick<AuthResponse, 'userId' | 'name' | 'phone' | 'token'>;

const USER_KEY = 'readlyte_user';
const ADMIN_KEY = 'readlyte_admin_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient) {}

  register(payload: { name: string; phone: string; password: string }): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${API_BASE_URL}/api/auth/register`, payload)
      .pipe(tap((res) => this.setUser(res)));
  }

  login(payload: { phone: string; password: string }): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${API_BASE_URL}/api/auth/login`, payload)
      .pipe(tap((res) => this.setUser(res)));
  }

  adminLogin(payload: { phone: string; password: string }): Observable<AdminAuthResponse> {
    return this.http
      .post<AdminAuthResponse>(`${API_BASE_URL}/api/auth/admin/login`, payload)
      .pipe(tap((res) => this.setAdminToken(res.token)));
  }

  logoutUser(): void {
    localStorage.removeItem(USER_KEY);
  }

  logoutAdmin(): void {
    localStorage.removeItem(ADMIN_KEY);
  }

  getUser(): StoredUser | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as StoredUser;
    } catch {
      return null;
    }
  }

  isLoggedIn(): boolean {
    return !!this.getUser()?.token;
  }

  getAdminToken(): string | null {
    return localStorage.getItem(ADMIN_KEY);
  }

  isAdminLoggedIn(): boolean {
    return !!this.getAdminToken();
  }

  userAuthHeaders(): HttpHeaders {
    const token = this.getUser()?.token;
    return token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();
  }

  adminAuthHeaders(): HttpHeaders {
    const token = this.getAdminToken();
    return token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();
  }

  private setUser(res: AuthResponse): void {
    const stored: StoredUser = {
      userId: res.userId,
      name: res.name,
      phone: res.phone,
      token: res.token
    };
    localStorage.setItem(USER_KEY, JSON.stringify(stored));
  }

  private setAdminToken(token: string): void {
    localStorage.setItem(ADMIN_KEY, token);
  }
}
