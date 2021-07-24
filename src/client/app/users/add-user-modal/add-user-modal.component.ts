import { Component, OnInit } from '@angular/core';
import { NgForm ,FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ApiService } from '../../shared/services/api/api.service';
import { User } from '../users-table/users-table-datasource';

@Component({
  selector: 'app-add-user-modal',
  templateUrl: './add-user-modal.component.html',
  styleUrls: ['./add-user-modal.component.css']
})
export class AddUserModalComponent implements OnInit {

  newUser!: User;

  editUserForm!: FormGroup;

  loading: Boolean = false;

  usernameServerError = '';
  adminServerError = '';
  passwordServerError = '';

  breakpoint!: number;


  constructor(
              private fb: FormBuilder,
              private editDialogRef: MatDialogRef<AddUserModalComponent>,
              private api : ApiService,
              private _EditedUserSnackBar: MatSnackBar,
              ) { }

  ngOnInit(): void {
    this.editUserForm = this.fb.group({
      username:   ['', Validators.required],
      admin   :   [true, Validators.required],
      password:   ['', Validators.required],
      })
  }

  onSubmit() {
    this.loading = true;

    const formValues = Object.assign({}, this.editUserForm.value);

    const user = {
      _id      : undefined,
      username : formValues.username,
      admin    : formValues.admin,
      password : formValues.password,
    };

    console.log(user);
    this.api.post('users/', user)
      .subscribe( (data: any) => {
        if( data.statusCode == 401 ) {
          alert( data.error );
        } else if (data.statusCode == 422) {
          console.log('from add-user-modal.component.js' + JSON.stringify(data.error));
          
          data.error.username ? (
            this.editUserForm.get('username')?.setErrors({ [`${data.error.username}`] : true}),
            this.usernameServerError = data.error.username
           ) : null;
          
           data.error.admin ? (
            this.editUserForm.get('admin')?.setErrors({ [`${data.error.admin}`] : true}),
            this.adminServerError = data.error.admin
           ) : null;
          
           data.error.password ? (
            this.editUserForm.get('password')?.setErrors({ [`${data.error.password}`] : true}),
            this.passwordServerError = data.error.password
           ) : null;
        } else {
          console.log( data );
          this.newUser = data;
          this._EditedUserSnackBar.open(`${this.newUser.username}` , 'Added!', {duration: 5000} );
          this.api.makeRefresh();
          this.editDialogRef.close();
        }
      });
  }

  onResize(event: any): void {
    this.breakpoint = event.target.innerWidth <= 600 ? 1 : 2;
  }

}
