import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
@Injectable()
export class AuthService {

  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  storageKey: string = 'contact-manager-jwt';

  constructor(private router: Router) { 
    this.loggedIn.next(this.getToken() !== null);
  }

  setToken(token: string) {
    localStorage.setItem(this.storageKey, token);
    this.loggedIn.next(true);
  }

  getToken() {
    return localStorage.getItem(this.storageKey);
  }

  isLoggedIn() {
    //return this.getToken() !== null;
    return this.loggedIn;
  }

  logout(sessionExpired? : boolean) {
    localStorage.removeItem(this.storageKey);
    this.loggedIn.next(false);
    if(sessionExpired) {
      this.router.navigate(['login'], { state: { sessionExpired: true } });
    } else {
      this.router.navigate(['login'], { state: { sessionExpired: false} });
    }
  }
}
