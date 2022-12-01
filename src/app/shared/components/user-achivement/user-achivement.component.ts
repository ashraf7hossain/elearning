import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-user-achivement',
  templateUrl: './user-achivement.component.html',
  styleUrls: ['./user-achivement.component.scss'],
})
export class UserAchivementComponent implements OnInit {

  cls:string = "";

  constructor() { }

  ngOnInit() {}

  close(){
    this.cls = "close";
    console.log(this.cls);
    
  }

}
