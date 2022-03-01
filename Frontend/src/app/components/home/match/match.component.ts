import {Component, Input, OnInit} from '@angular/core';
import {MatchOverview} from "../../../../assets/Interface/match";

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.scss']
})
export class MatchComponent implements OnInit {
  @Input() matchData:MatchOverview|undefined;
  constructor() { }

  ngOnInit(): void {
  }

}
