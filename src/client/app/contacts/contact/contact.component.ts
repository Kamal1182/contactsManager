import { Component, OnInit, Input, HostBinding } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Contact } from '../../shared/model/contact.model';
import { EditContactModalComponent } from '../edit-contact-modal/edit-contact-modal.component';
import { DeleteContactModalComponent } from '../delete-contact-modal/delete-contact-modal.component';
@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  @Input() contact!: Contact;

  @HostBinding('class') columnClass = 'four wide column';

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
  }

  openEditDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = '640px';
    dialogConfig.data = this.contact;

    this.dialog.open(EditContactModalComponent, dialogConfig);
  }

  openDeleteDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = '640px';
    dialogConfig.data = this.contact;

    this.dialog.open(DeleteContactModalComponent, dialogConfig);
  }

}
