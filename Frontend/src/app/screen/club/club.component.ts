import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {MatchService} from "../../service/match.service";
import {MatchOverview} from "../../../assets/Interface/match";

@Component({
  selector: 'app-club',
  templateUrl: './club.component.html',
  styleUrls: ['./club.component.scss']
})
export class ClubComponent implements OnInit {
  match: number = -1;
  matches: MatchOverview[] = [];

  constructor(private router: Router, private service: MatchService) {
    let state = this.router.getCurrentNavigation()?.extras.state;
    if (state != undefined && state.hasOwnProperty("data")) {
      this.match = state.data
      console.log(this.match)
    }
  }

  ngOnInit(): void {
    this.service.getClub(this.match).subscribe(val => {
      if (val) {
        this.matches = val;
      }
    })
  }

  getYear(index:number) {

  }

}
