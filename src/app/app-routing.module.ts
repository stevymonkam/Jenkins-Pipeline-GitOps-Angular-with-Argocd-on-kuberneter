import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { CreateProductComponent } from './pages/create-product/create-product.component';
import { HomeComponent } from './pages/home/home.component';
import { ProductsComponent } from './pages/products/products.component';







//const routes: Routes = [];
const routes: Routes = [
  { path: '', redirectTo: 'login',pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'password-reset', redirectTo: 'password-reset', pathMatch: 'full'},
  { path: 'user/new-password/:token', redirectTo: 'user/new-password/:token', pathMatch: 'full' },
  //{ path: 'home', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home',component: HomeComponent },
  { path: 'create-product',component: CreateProductComponent },

  { path: 'products/:p1/:p2',component: ProductsComponent },
  { path: 'products', redirectTo: 'products/1/0', pathMatch: 'full' },
  //{ path: 'products',component:ProductsComponent },




 





 
  
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
