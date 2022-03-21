import {Component, Input, OnInit, SimpleChanges} from '@angular/core';
import { Router } from '@angular/router';
import { RouterMatchDetail } from 'src/assets/Interface/Router';
import {MatchOverview} from "../../../assets/Interface/match";
import {interval, Subscription} from "rxjs";

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.scss']
})
export class MatchComponent implements OnInit {
  @Input() matchData:MatchOverview|undefined;

  progress:number|undefined;
  changing = interval(1000*60);
  subscription:Subscription|undefined;

  constructor(private router:Router) { }

  ngOnInit(): void {
   this.subscription= this.changing.subscribe(val=>this.getPercent())
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  moveTo() {
    if (this.matchData) {
      const id:RouterMatchDetail = {
        data:this.matchData?.id
      }

      this.router.navigateByUrl('match',{state:id});
    }

  }
  getPercent() {
    if (this.matchData) {
      const current = new Date();
      const matchDate = new Date(this.matchData.start)
      if (matchDate.getTime()>current.getTime()) {
        this.progress = undefined;
      } else {
        this.progress =(current.getTime()- matchDate.getTime())/(1000*60)/90*100;
      }
    } else {
      this.progress = undefined;
    }



  }

}
