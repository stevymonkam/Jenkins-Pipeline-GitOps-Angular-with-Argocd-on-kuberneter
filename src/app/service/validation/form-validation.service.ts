import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormValidationService {

  constructor( private formBuilder: FormBuilder) { }

  detaglioProductForm(detaglioProduct: any, status: any) {
    if (status == "edit") {
      console.log("les details du produit apres");

      console.log(detaglioProduct.id_product);

    //console.log(JSON.stringify(detaglioProduct));
    let formEdit: FormGroup = this.formBuilder.group({
    id:[detaglioProduct.id, Validators.required],
    //id_cat:[detagliocontrato.id_cat, {readonly :true}, Validators.required],
    name: [detaglioProduct.name, Validators.required],
    photoName: [detaglioProduct.photoName, Validators.required],
    description: [detaglioProduct.description],
    promotion: [detaglioProduct.promotion],
    selected: [detaglioProduct.selected],
    available: [detaglioProduct.available],
    currentprice: [detaglioProduct.currentprice],
    idCat: [detaglioProduct.idCat],

    });
      return formEdit;
    } else {

    let formAdd: FormGroup = this.formBuilder.group({
    id:[''],
    name: ['', Validators.required],
    photoName: [''],
    description: ['', Validators.required],
    promotion: [''],
    selected: [''],
    available: [''],
    currentprice: ['',Validators.required],
    idCat: ['',Validators.required],

    });

      return formAdd;
    }
  }
}
