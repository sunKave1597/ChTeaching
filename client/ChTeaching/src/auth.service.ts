import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn = this.isLoggedInSubject.asObservable();
  email = '';

  login(email: string) {
    this.isLoggedInSubject.next(true);
    this.email = email;
  }

  logout() {
    this.isLoggedInSubject.next(false);
    this.email = '';
  }
}