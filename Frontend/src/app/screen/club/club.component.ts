import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {MatchService} from "../../service/match.service";
import {MatchOverview} from "../../../assets/Interface/match";
import {ClubDetail} from "../../../assets/Interface/Router";

@Component({
  selector: 'app-club',
  templateUrl: './club.component.html',
  styleUrls: ['./club.component.scss']
})
export class ClubComponent implements OnInit {
  club: ClubDetail | null = null;
  matches: MatchOverview[] = [];

  constructor(private router: Router, private service: MatchService) {
    let state = this.router.getCurrentNavigation()?.extras.state;
    if (state) {
      this.club = state as ClubDetail;
      this.service.getClub(this.club.id).subscribe(val => {
        if (val) {
          this.matches = val;
        }
      });
    }
  }

  ngOnInit(): void {
  }

  getYear(index: number): number {
    if (index == 0) {
      return new Date(this.matches[0].start).getFullYear();
    }
    const datecurrent = new Date(this.matches[index].start);
    const dateprevious = new Date(this.matches[index - 1].start)
    if (datecurrent.getFullYear() > dateprevious.getFullYear()) {
      return datecurrent.getFullYear();
    }
    return -1;
  }

}
