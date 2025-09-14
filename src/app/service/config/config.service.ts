import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  API_URL: string
  API_URL2: string
  constructor() {
    this.API_URL='http://109.176.198.187:30086/api';
    this.API_URL2='http://localhost:8080';

    //this.API_URL='https://cors-anywhere.herokuapp.com/http://api.contratti.immobiliz.com/api'; //http://127.0.0.1:8000
  }

}
