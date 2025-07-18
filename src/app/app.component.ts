import { Component, OnInit } from '@angular/core';
import { CatelogueService } from './service/catelogue/catelogue.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  categories: any;
  title: any;

  constructor(private catService: CatelogueService){}

  ngOnInit(): void {
  }

  
  
  

}
