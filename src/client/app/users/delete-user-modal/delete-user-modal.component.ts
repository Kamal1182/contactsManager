import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ApiService } from '../../shared/services/api/api.service';
import { User } from '../users-table/users-table-datasource';

@Component({
  selector: 'app-delete-user-modal',
  templateUrl: './delete-user-modal.component.html',
  styleUrls: ['./delete-user-modal.component.css']
})
export class DeleteUserModalComponent implements OnInit {

  user: User;

  constructor(
              @Inject(MAT_DIALOG_DATA) data: User,
              private deleteDialogRef: MatDialogRef<DeleteUserModalComponent>,
              private api : ApiService,
              private _DeleteUserSnackBar: MatSnackBar,
             ) { 
                  this.user = data; 
               }

  ngOnInit(): void {
  }

  deleteUser() {
    this.api.delete('users/'+this.user._id)
      .subscribe( (data: any) => {
        if( data.statusCode == 401 ) {
          alert( data.error );
        } else {
          console.log( data );
          this._DeleteUserSnackBar.open(`${this.user.username}` , 'Deleted!', {duration: 5000} );
          this.api.makeRefresh();
          this.deleteDialogRef.close();
        }
      });
  }

}  
