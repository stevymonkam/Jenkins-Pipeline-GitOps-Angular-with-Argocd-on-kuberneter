import { Component, OnInit } from '@angular/core';
import { CatelogueService } from 'src/app/service/catelogue/catelogue.service';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css']
})
export class CreateProductComponent implements OnInit {
  idcat: any;
  flagCat: boolean | undefined;
  selectedFiles: any;
  category: any;

  constructor(public catService: CatelogueService) { }

  ngOnInit(): void {
    this.getCategories();

  }

  onSelectedFile(event: any){
    this.selectedFiles = event.target.files;
    
 }

  onChange(event: any){
    this.idcat = event;
    this.flagCat = true;
    console.log("voicii les categories .............................. +++++++++++++++++");
    console.log(event);

  }
  getCategories() {
    this.catService.getResource().then((data) => {
        this.category = data.listcat;
        console.log("list cat sucess");
        console.log(data);
    }).catch((error) => {
        console.log("il ya erreur");
    });
}

}
