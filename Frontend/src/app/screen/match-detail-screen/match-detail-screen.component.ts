import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-match-detail-screen',
  templateUrl: './match-detail-screen.component.html',
  styleUrls: ['./match-detail-screen.component.scss']
})
export class MatchDetailScreenComponent implements OnInit {
  match:string="";
  constructor(private router:Router) {
    let state =this.router.getCurrentNavigation()?.extras.state;
    if (state != undefined&&state.hasOwnProperty("data")) {
      this.match = state.data
    }
  }

  ngOnInit(): void {

  }

}
