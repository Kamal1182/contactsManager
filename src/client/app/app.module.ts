import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Material section
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from './angularMaterial/angular-material.module';
/* import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu'; */

// Routing
import { AppRoutingModule } from './app-routing.module';

// Services
import { ApiService } from './shared/services/api/api.service';
import { AuthService } from './shared/services/auth/auth.service';

// Interceptors
import { HeaderTokenInterceptor } from './shared/interceptor/header-token.interceptor';

import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/layout/header/header.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,

    HttpClientModule,

    FormsModule,
    ReactiveFormsModule,

    // Material
    BrowserAnimationsModule,
    AngularMaterialModule
    /* 
    BrowserAnimationsModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatToolbarModule,
    MatMenuModule */
  ],
  providers: [ApiService, 
              AuthService,
              { provide: HTTP_INTERCEPTORS, useClass: HeaderTokenInterceptor, multi: true }
             ],
  bootstrap: [AppComponent]
})
export class AppModule { }
