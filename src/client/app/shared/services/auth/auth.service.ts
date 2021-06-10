import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class AuthService {

  constructor(private router: Router) { }

  storageKey: string = 'contact-manager-jwt';

  setToken(token: string) {
    localStorage.setItem(this.storageKey, token);
  }

  getToken() {
    return localStorage.getItem(this.storageKey);
  }

  isLoggedIn() {
    return this.getToken() !== null;
  }

  logout(sessionExpired? : boolean) {
    localStorage.removeItem(this.storageKey);
    if(sessionExpired) {
      this.router.navigate(['login'], { state: { sessionExpired: true } });
    } else {
      this.router.navigate(['login'], { state: { sessionExpired: false} });
    }
  }
}
