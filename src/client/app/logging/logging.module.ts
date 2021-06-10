import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoggingRoutingModule } from './logging-routing.module';
import { LoginComponent } from './login/login.component';
import { AngularMaterialModule } from '../angularMaterial/angular-material.module';
// Form section
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    LoggingRoutingModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    FormsModule,
    
  ]
})
export class LoggingModule { }
