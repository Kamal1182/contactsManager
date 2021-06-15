import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isUnchanged = true;

  loggedIn : boolean = false;

  constructor(private auth: AuthService) { 
    this.auth.isLoggedIn().subscribe( data => this.loggedIn = data);
   }

  ngOnInit(): void {
    this.auth.isLoggedIn().subscribe( data => this.loggedIn = data);
  }

  logout() {
    this.auth.logout(false);
  }
}
