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
    this.currentDate = date.getDate().toFixed(0);
    this.currentDate.concat(date.getMonth().toFixed(0))
  }

}
