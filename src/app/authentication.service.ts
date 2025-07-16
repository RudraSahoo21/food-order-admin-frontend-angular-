import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  // token
  private tokenSubject = new BehaviorSubject<string>(
    localStorage.getItem('token') ?? ''
  );
  token$ = this.tokenSubject.asObservable();
  setToken(token: string): void {
    localStorage.setItem('token', token);
    this.tokenSubject.next(token);
  }
  clearToken(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.tokenSubject.next('');
    this.userSubject.next(null); // reset user
  }
  getToken(): string {
    return this.tokenSubject.value;
  }

  // user
  private userSubject = new BehaviorSubject<any>(
    JSON.parse(localStorage.getItem('user') || 'null')
  );
  user$ = this.userSubject.asObservable();
  setUser(user: any): void {
    localStorage.setItem('user', JSON.stringify(user));
    this.userSubject.next(user);
  }

  getUser(): string {
    return this.userSubject.value;
  }
}
