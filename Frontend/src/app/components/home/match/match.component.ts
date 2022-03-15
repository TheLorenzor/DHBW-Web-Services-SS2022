import {Component, Input, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { RouterMatchDetail } from 'src/assets/Interface/Router';
import {MatchOverview} from "../../../../assets/Interface/match";

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.scss']
})
export class MatchComponent implements OnInit {
  @Input() matchData:MatchOverview|undefined;
  constructor(private router:Router) { }

  ngOnInit(): void {
  }

  moveTo(matchId:string) {
    const t:RouterMatchDetail = {
      data:matchId
    }

    this.router.navigateByUrl('match',{state:t});

  }

}
