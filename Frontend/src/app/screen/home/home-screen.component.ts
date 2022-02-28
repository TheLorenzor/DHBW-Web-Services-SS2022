import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-screen',
  templateUrl: './home-screen.component.html',
  styleUrls: ['./home-screen.component.scss']
})
export class HomeScreenComponent implements OnInit {

  constructor() { }
  currentDate:string = ""

  ngOnInit(): void {
    let date = new Date();
    let tag = "";
    tag=date.getDate().toString()+"."+date.getMonth().toString()+"."+date.getFullYear().toString()+" - "
    switch (date.getDay()) {
      case 1:
        tag=tag+"Montag";
        break;
      case 2:
        tag=tag+"Dienstag";
        break;
      case 3:
        tag=tag+"Mittwoch";
        break;
      case 4:
        tag=tag+"Donnerstag";
        break;
      case 5:
        tag=tag+"Freitag";
        break;
      case 6:
        tag=tag+"Samstag";
        break;
      case 7:
        tag=tag+"Sonntag";
        break;

    }
    this.currentDate = tag
  }

}
