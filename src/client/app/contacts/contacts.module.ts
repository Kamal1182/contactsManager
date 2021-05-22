import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContactsRoutingModule } from './contacts-routing.module';
import { ContactComponent } from './contact/contact.component';
import { ContactListComponent } from './contact-list/contact-list.component';

// Material
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    ContactComponent,
    ContactListComponent
  ],
  imports: [
    CommonModule,
    ContactsRoutingModule,

    // Material
    MatButtonModule,
    MatCardModule,
    MatIconModule
  ]
})
export class ContactsModule { }
