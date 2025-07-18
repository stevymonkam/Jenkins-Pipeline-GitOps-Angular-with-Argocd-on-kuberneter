import { Component, OnInit } from '@angular/core';
import { CatelogueService } from 'src/app/service/catelogue/catelogue.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';





@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})



export class HomeComponent implements OnInit {
  categories: any;
  
  

  constructor(private catService: CatelogueService, private modalService: NgbModal, private toastrService: ToastrService,){}

  ngOnInit(): void {
    this.getCategories();
  }
  emitterSomething(event: any){
    //console.log("voiciii  111 event");

   // console.log(event);
  }

  getCategories() {

    this.catService.getResource().then((data) => {
      console.log("sucess");

     // console.log(data);
      this.categories = data.listcat;
      
      
    }).catch((error) => {
      console.log("il ya erreur");
    });
  }
  public showSuccess(): void {
    this.toastrService.success('Message Success!', 'Title Success!');
  }

  public showInfo(): void {
    this.toastrService.info('Message Info!', 'Title Info!');
  }

  public showWarning(): void {
    this.toastrService.warning('Message Warning!', 'Title Warning!');
  }

  public showError(): void {
    this.toastrService.error('Message Error!', 'Title Error!');
  }
  showToaster(){
    //alert('1')
    
}


 

 

}
