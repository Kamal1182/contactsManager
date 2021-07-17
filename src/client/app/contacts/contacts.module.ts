import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContactsRoutingModule } from './contacts-routing.module';
import { ContactComponent } from './contact/contact.component';
import { ContactListComponent } from './contact-list/contact-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
 
// Material
import { AngularMaterialModule } from '../angularMaterial/angular-material.module';
import { SearchContactPipe } from '../pipe/contacts/search-contact.pipe';
import { EditContactModalComponent } from './edit-contact-modal/edit-contact-modal.component';
import { AddContactModalComponent } from './add-contact-modal/add-contact-modal.component';


/* import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon'; */

@NgModule({
  declarations: [
    ContactComponent,
    ContactListComponent,
    SearchContactPipe,
    EditContactModalComponent,
    AddContactModalComponent
  ],
  imports: [
    CommonModule,
    ContactsRoutingModule,

    // Material
    AngularMaterialModule,
    /* MatButtonModule,
    MatCardModule,
    MatIconModule */

    FormsModule,
    ReactiveFormsModule
  ]
})
export class ContactsModule { }
