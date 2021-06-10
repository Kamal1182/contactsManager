import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class AuthService {

  constructor(private router: Router) { }

  storageKey: string = 'contact-manager-jwt';

  setToken(token: string) {
    console.log(`from auth.service.ts: ${token}`);
    localStorage.setItem(this.storageKey, token);
    console.log(localStorage.getItem(this.storageKey));
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
