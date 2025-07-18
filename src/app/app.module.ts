import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatTableModule} from '@angular/material/table';
import { MatPaginatorModule } from "@angular/material/paginator";

import { FormsModule} from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoginComponent } from './pages/auth/login/login.component';
import { AuthentificationInterceptor } from './security/authentification.interceptor';
import { AuthService } from './service/auth/auth.service';
import { ConfigService } from './service/config/config.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './pages/home/home.component';
import { CatelogueService } from './service/catelogue/catelogue.service';
import { HeaderComponent } from './pages/header/header.component';
import { ProductsComponent } from './pages/products/products.component';
import { BeingDirective } from './being.directive';
import { ProvaComponent } from './pages/prova/prova.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatSortModule } from '@angular/material/sort';
import { CreateProductComponent } from './pages/create-product/create-product.component';
import {  MatInputModule } from "@angular/material/input";
import { CommonModule } from '@angular/common';
import { RegisterComponent } from './pages/auth/register/register.component';
import {MatButtonModule} from '@angular/material/button';






@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    HeaderComponent,
    ProductsComponent,
    BeingDirective,
    ProvaComponent,
    CreateProductComponent,
    RegisterComponent
   

  ],
  imports: [
    MatButtonModule,
    BrowserModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    FormsModule,
    AppRoutingModule,
    MatPaginatorModule,
    MatTableModule,
    HttpClientModule,
    CommonModule,
    
 
    // angular material modules
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,

    ToastrModule.forRoot(),
         NgbModule,
  ],
  providers: [
    HttpClientModule,
    ConfigService,
    CatelogueService,
   
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthentificationInterceptor,
      multi: true
    }

  ],
  bootstrap: [AppComponent],
  exports: [
   
    BrowserAnimationsModule,
    // angular material modules
    MatInputModule,

   
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }

