import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContactsRoutingModule } from './contacts-routing.module';
import { ContactComponent } from './contact/contact.component';
import { ContactListComponent } from './contact-list/contact-list.component';
import { FormsModule } from '@angular/forms';
 
// Material
import { AngularMaterialModule } from '../angularMaterial/angular-material.module';
import { SearchContactPipe } from '../pipe/contacts/search-contact.pipe';


/* import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon'; */

@NgModule({
  declarations: [
    ContactComponent,
    ContactListComponent,
    SearchContactPipe
  ],
  imports: [
    CommonModule,
    ContactsRoutingModule,

    // Material
    AngularMaterialModule,
    /* MatButtonModule,
    MatCardModule,
    MatIconModule */

    FormsModule
  ]
})
export class ContactsModule { }
