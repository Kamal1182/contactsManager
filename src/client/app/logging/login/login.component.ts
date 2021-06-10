import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../shared/services/api/api.service';
import { AuthService } from '../../shared/services/auth/auth.service';
import { Observable, throwError } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  userServerError = '';
  passwordServerError = '';
  sessionExpired : boolean = false;

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) { 
      this.validateLoginForm();
      // if(this.router.getCurrentNavigation()!.extras.state) {
      //   this.sessionExpired = this.router.getCurrentNavigation()!.extras.state!.sessionExpired;
      // }
  }

  validateLoginForm() {
    this.loginForm = this.fb.group({
      username: ["", Validators.required],
      password: ["", Validators.required]
    })
  }

  ngOnInit(): void {
    if(this.auth.isLoggedIn()) {
      this.router.navigate(['contacts']);
    }
  }

  onSubmit() {

    const formValues = this.loginForm.value;

    this.userServerError = '';
    this.passwordServerError = '';

    const payload = { 
      username : formValues.username,
      password : formValues.password
    };

    this.api.post( 'authenticate', payload )
      .subscribe( data => {
        console.log(data);
        console.log(data.statusCode);
        if( data.statusCode == 404 ) {
            this.userServerError = data.error.error;
            //Observable.throwError(data);
        } else if( data.statusCode == 401 ) {
            this.passwordServerError = data.error.error;
            //Observable.throwError(data);
        } else if( data.statusCode == 422 ) {
            this.userServerError = data.error.error.username;
            this.passwordServerError = data.error.error.password;
        } else {
            console.log('I am here');
            this.auth.setToken(data.token);
            this.router.navigate(['contacts']);
       }
      });
  }
}
