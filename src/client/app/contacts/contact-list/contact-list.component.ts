import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Contact } from '../../shared/model/contact.model';
import { ApiService } from '../../shared/services/api/api.service';
import { AuthService } from '../../shared/services/auth/auth.service';
import { AddContactModalComponent } from '../add-contact-modal/add-contact-modal.component';


@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements OnInit {

  contacts!: Contact[];

  seachTerm: string = '';

  breakpoint!: number;

  constructor(private api: ApiService, private auth: AuthService,
              private addNewContactdialog: MatDialog
             ) { 
    api.refreshCall$.subscribe(
      () => {
        this.refeshContacts(null);
      }  
    );
  }

  ngOnInit(): void {

    //this.contacts = this.api.get('contacts').unsubscribe;

    this.api.get('contacts')
      .subscribe(data => {
        this.contacts = data;
      });

    if(window.innerWidth <= 608) {
      this.breakpoint = 1;
    } else if (window.innerWidth <= 907) {
      this.breakpoint = 2;
    } else {
      this.breakpoint = 3;
    }
  }

  refeshContacts(event: null){
    this.ngOnInit();
  }

  onResize(event: any) {
    if(event.target.innerWidth <= 608) {
      this.breakpoint = 1;
    } else if (event.target.innerWidth <= 907) {
      this.breakpoint = 2;
    } else {
      this.breakpoint = 3;
    }
  }

  openAddNewContactDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = '640px';

    this.addNewContactdialog.open(AddContactModalComponent, dialogConfig);
  }

}
