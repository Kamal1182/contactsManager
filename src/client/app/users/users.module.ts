import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { UsersTableComponent } from './users-table/users-table.component';
// import { MatTableModule } from '@angular/material/table';
// import { MatPaginatorModule } from '@angular/material/paginator';
// import { MatSortModule } from '@angular/material/sort';
import { AngularMaterialModule } from '../angularMaterial/angular-material.module';


@NgModule({
  declarations: [UsersTableComponent],
  imports: [
    CommonModule,
    UsersRoutingModule,
    // MatTableModule,
    // MatPaginatorModule,
    // MatSortModule
    AngularMaterialModule
  ]
})
export class UsersModule { }
