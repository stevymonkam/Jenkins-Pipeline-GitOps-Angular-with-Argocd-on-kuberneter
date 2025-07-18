import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from '../config/config.service';

@Injectable({
  providedIn: 'root'
})
export class CatelogueService {

  public host:string="http://localhost:8080/api/auth";
  
  public api_url: string;
  public api_url2: string;

  headers = new HttpHeaders().set('Content-Type', 'application/json');
  constructor(config: ConfigService, private httpClient: HttpClient) {
    this.api_url = config.API_URL;
    this.api_url2 = config.API_URL2;
  }

 
  async getResource(): Promise < any > {
    const url = `${this.api_url}/auth/catalogue/list`;
    const res = await this.httpClient.get(url).toPromise();
    return res;
  }
  
  async getProducts(): Promise < any > {
    const url = `${this.api_url}/auth/product/list`;
    const res = await this.httpClient.get(url).toPromise();
    return res;
  }

  async getProductsBySearch(url:any): Promise < any > {
    const url2 = `${this.api_url2}/${url}`;
    const url3 = "http://localhost:8080/products/search/promoProducts";
    console.log("data before sending  url" + JSON.stringify(url));

    console.log("data before sending url2" + JSON.stringify(url2));
    const headers = new HttpHeaders();

    headers.append("Access-Control-Allow-Origin", "*");
    headers.append("Access-Control-Allow-Methods", "PUT,GET,POST,DELETE");
    headers.append("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");    
    const res = await this.httpClient.get(url3, {headers}).toPromise();
    return res;
  }
   getProductsBySearch1(url:any){
    const url3 = "https://localhost:8080/products/search/promoProducts";
    
    return this.httpClient.get(url3);
}

 
  getPhoto(id: any): Observable<Blob> {
    const url = `${this.api_url}/auth/photoProduct/${id}`;
    const res = this.httpClient.get(url, { responseType: 'blob' });
    return res;
  }

  getImage(imageUrl: string): Observable<Blob> {
    return this.httpClient.get(imageUrl, { responseType: 'blob' });
  }

  uploadPhotoProduct(file: any, idProduct: any, idcat: any):  Promise < any > {
    const formdata: FormData = new FormData();
    let fileName:string = 'ecomerce-'+ new Date().getTime(); //get name from form for example
    let fileExtension:string = file.name.split('?')[0].split('.').pop();
    formdata.append('file', file, fileName+'.'+fileExtension);
    formdata.append('idcat', idcat);


    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    console.log(file);
    
    return this.httpClient.post < any > (`${this.api_url}/auth/uploadPhoto/${idProduct}`, formdata).toPromise();
  }

  create(data: any): Promise < any > {
    //data.id_user = localStorage.getItem("idUser");
    
    //console.log("data before sending " + JSON.stringify(data));
    console.log(data);
    const url = `${this.api_url}/auth/product/create`;
    const res = this.httpClient.post <any> (url, data).toPromise();
    return res;
  }

  update(data: any): Promise < any > {
   console.log(data);
   console.log("data before sending fin stevy monkam" + JSON.stringify(data));
   const url = `${this.api_url}/auth/product/update/${data.id}`;
    const res =  this.httpClient.put(url, data).toPromise();
    return res;
  }

  async deletProduct(data: any): Promise < any > {
    
    console.log("data before sending " + JSON.stringify(data));
     const res = await this.httpClient.delete < any > (`${this.api_url}/auth/product/delete/${data.id}`).toPromise();
     return res;
  }


  
}
