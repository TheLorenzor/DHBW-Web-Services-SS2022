import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {MatchService} from "../../service/match.service";
import {MatchOverview} from "../../../assets/Interface/match";
import {Login} from "../../../assets/Interface/state";
import {select, Store} from "@ngrx/store";
import {RouterMatchDetail} from "../../../assets/Interface/Router";

@Component({
  selector: 'app-match-detail-screen',
  templateUrl: './match-detail-screen.component.html',
  styleUrls: ['./match-detail-screen.component.scss']
})
export class MatchDetailScreenComponent implements OnInit {
  match:number=-1;
  betEnable = false;
  betting = {
    home:'',
    guest:''
  }

  data:MatchOverview|null = null;

  account:Login|null = null;
  accountSubscription =this.store.pipe(select(state => {
    return state
  }));


  constructor(private router:Router,private service:MatchService,private store:Store) {
    let state =this.router.getCurrentNavigation()?.extras.state;
    if (state != undefined&&state.hasOwnProperty("data")) {
      this.match = state.data
    }
  }

  ngOnInit(): void {
    this.service.getMatchDetails(this.match).subscribe(val=>{
      this.data=val;
    });

    this.accountSubscription.subscribe(res=>{
      // @ts-ignore
      this.account = res['accounts']['loginUser']
    })
  }
  getStartDate():string {
    if (this.data) {
      const date = new Date(this.data.start);
      return date.getDate()+'.'+date.getMonth()+'.'+date.getFullYear()+' '+date.getHours()+':'+date.getMinutes()+' Uhr';
    }
    return ''
  }
  bet() {

  }
  deleteBet() {

  }
  goToClub(club:number) {
    if (this.data) {
      let id:RouterMatchDetail = {
        data:-1
      }
      if (club>0) {
        id.data=this.data.club1.id
      } else {
        id.data=this.data.club2.id
      }
      this.router.navigateByUrl('club',{state:id});
    }
  }

}
