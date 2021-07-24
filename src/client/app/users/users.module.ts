import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UsersTableComponent } from './users-table/users-table.component';
// import { MatTableModule } from '@angular/material/table';
// import { MatPaginatorModule } from '@angular/material/paginator';
// import { MatSortModule } from '@angular/material/sort';
import { AngularMaterialModule } from '../angularMaterial/angular-material.module';
import { DeleteUserModalComponent } from './delete-user-modal/delete-user-modal.component';
import { EditUserModalComponent } from './edit-user-modal/edit-user-modal.component';
import { AddUserModalComponent } from './add-user-modal/add-user-modal.component';


@NgModule({
  declarations: [UsersTableComponent, DeleteUserModalComponent, EditUserModalComponent, AddUserModalComponent],
  imports: [
    CommonModule,
    UsersRoutingModule,
    // MatTableModule,
    // MatPaginatorModule,
    // MatSortModule
    AngularMaterialModule,
    FormsModule,
    ReactiveFormsModule
  ] 
})
export class UsersModule { }
