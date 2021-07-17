import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Contact } from '../../shared/model/contact.model';
import { ApiService } from '../../shared/services/api/api.service';

@Component({
  selector: 'app-delete-contact-modal',
  templateUrl: './delete-contact-modal.component.html',
  styleUrls: ['./delete-contact-modal.component.css']
})
export class DeleteContactModalComponent implements OnInit {

  contact: Contact;

  constructor(
              @Inject(MAT_DIALOG_DATA) data: Contact,
              private deleteDialogRef: MatDialogRef<DeleteContactModalComponent>,
              private api : ApiService,
              private _EditedContactsnackBar: MatSnackBar
             ) { 
                this.contact = data;
               }

  ngOnInit(): void {
  }

  deleteContact() {
    this.api.delete('contacts/'+this.contact._id)
      .subscribe( (data: any) => {
        if( data.statusCode == 401 ) {
          alert( data.error );
        } else {
          console.log( data );
          this._EditedContactsnackBar.open(`${this.contact.firstName} ${this.contact.lastName}`, 'Deleted!', {duration: 5000} );
          this.api.makeRefresh();
          this.deleteDialogRef.close();
        }
      });
  }

}
