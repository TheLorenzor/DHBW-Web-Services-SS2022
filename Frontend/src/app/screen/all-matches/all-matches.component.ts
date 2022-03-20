import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Liga, MatchOverview} from "../../../assets/Interface/match";
import {MatchService} from "../../service/match.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-all-matches',
  templateUrl: './all-matches.component.html',
  styleUrls: ['./all-matches.component.scss']
})
export class AllMatchesComponent implements OnInit {

  selectTurnament = true;
  liga:Liga[] = []
  matchesSubscription :Subscription|undefined;
  ligaSubscription:Subscription|undefined;
  matches:MatchOverview[]=[]

  constructor(private route:ActivatedRoute, private router:Router,private service:MatchService) {
  }

  ngOnInit(): void {
   this.ligaSubscription= this.service.getAllLiga().subscribe(liga=>{
      this.liga =liga;
    })
  }


  selectTorunament(id:number) {
    this.selectTurnament= false;
    this.ligaSubscription?.unsubscribe();
    if (id==-1) {
      id = 1;
    }
    this.matchesSubscription = this.service.getMatches(id).subscribe(res=>{
      this.matches=res;
    });
  }


  showDate(match:MatchOverview):string {
    if (match.inorderId==0) {
     return match.spieltag+'. Spieltag'
    } else {
      if (match.spieltag>this.matches[match.inorderId-1].spieltag) {
        return match.spieltag+'. Spieltag'
      }
    }
    return ''
  }

  changeDate(test:string) {
    const date = new Date(test);
    console.log(JSON.stringify(date));

  }

}
