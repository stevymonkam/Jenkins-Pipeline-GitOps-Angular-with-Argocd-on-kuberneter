import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth/auth.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {

  isCambio: boolean = false;
  isAnnulla: boolean = true;
  fa: FormGroup;
  fa1: FormGroup;
  username: string = '';
  submitted: boolean = false;
  credenziale_non_valid: boolean = false;
  colone_stabilise_error: boolean = true;
  flag_aggior: boolean = false;
  flag_non_aggior: boolean = false;
  loading: boolean = false;
  constructor(fb: FormBuilder, private router: Router, private authService: AuthService) {
    this.fa = fb.group({
      'username': [null, Validators.compose([Validators.required])],
      'password': [null, Validators.required]
    });
    this.fa1 = fb.group({
      'username': [null, Validators.required],
      'password': [null, Validators.required],
      "password_confirmation": [null, Validators.required]
    });
  }

  ngOnInit(): void {

  }
  
   async login() {
     

    this.loading = true;
    await this.authService.login(this.fa.value.username, this.fa.value.password).then((res: any) => {
      console.log(res);
      console.log(res.accessToken);
      console.log(res.id);
      console.log(res.username);
      this.router.navigate(['products']);
      localStorage.setItem("token", res.accessToken);
      localStorage.setItem("idUser", res.id);
      localStorage.setItem("roles", res.roles);



      //localStorage.setItem("idRole", res.role[0].id);
      console.log('ecco id role');
      console.log(localStorage.getItem('idRole'));
      console.log(localStorage.getItem("idUser"));
     

    }).catch((error: any) => {
      console.log('111111111111111111111111');
      console.log('je suis dans dans errorror');
      this.loading = false;
      console.log(error);
      this.credenziale_non_valid = true;
      this.colone_stabilise_error = false;
      //this.modalService.dismissAll();
    });;

  }

}

