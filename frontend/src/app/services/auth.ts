import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

export interface AuthResponse {
  success: boolean;
  token?: string;
  username?: string;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = `${environment.apiUrl}/auth`;

  private currentUserSubject = new BehaviorSubject<string | null>(localStorage.getItem('username'));
  currentUser$ = this.currentUserSubject.asObservable();

  get isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  get token(): string | null {
    return localStorage.getItem('token');
  }

  get currentUsername(): string | null {
    return localStorage.getItem('username');
  }

  register(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, { username, password });
  }

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { username, password }).pipe(
      tap(res => {
        if (res.success && res.token && res.username) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('username', res.username);
          this.currentUserSubject.next(res.username);
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }
}
