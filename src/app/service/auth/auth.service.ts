import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpBackend, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ConfigService } from 'src/app/service/config/config.service';
import { Router } from '@angular/router';




@Injectable({
  providedIn: 'root'
})
export class AuthService {


 userId: any;
 roles:any;


   api_url: string;
 headers = new HttpHeaders().set('Content-Type', 'application/json');

 constructor(config: ConfigService, public router: Router, private httpClient: HttpClient, handler: HttpBackend) {
   this.api_url = config.API_URL;
   /************************************************/
   /**/ /* this is to avoid interceptor catch */  /**/
   /**/                                          /**/
   /**/ this.httpClient = new HttpClient(handler); /**/
   /**/                                          /**/
   /************************************************/
 }

  /*login(data: any) {
    return this.http.post(this.host2 , data, {observe: 'response'});
  }*/
  saveToken(jwt: string) {
    localStorage.setItem('token', jwt);

  }
  login(username: string, password: string): Promise<any> {

    return this.httpClient.post<any>(`${this.api_url}/auth/signin`, { username, password }).toPromise();
  }



  loadToken(){
    const Tokenjwt = localStorage.getItem('token');
    console.log("Tokenjwt");

    console.log(Tokenjwt);
    return Tokenjwt;
    }

    getAccessToken() {
      return localStorage.getItem('token');
    }

    isAdmin(){
      const id = localStorage.getItem("idUser");
      this.roles = localStorage.getItem("roles");

      if(id!=null && id!=""){
        if(this.roles.indexOf('ADMIN')>-1){
           return true;
        }
      }
      return false;
    }


 saveId(id:any) {
  localStorage.setItem('num', id);
  this.userId = id;
 }

 GetId() {
  const Tokenjwt = localStorage.getItem('num');
   return Tokenjwt;
 }



}
