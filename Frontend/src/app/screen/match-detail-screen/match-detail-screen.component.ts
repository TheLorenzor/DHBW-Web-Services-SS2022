import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {MatchService} from "../../service/match.service";
import {MatchBet, MatchOverview} from "../../../assets/Interface/match";
import {Login} from "../../../assets/Interface/state";
import {select, Store} from "@ngrx/store";
import {ClubDetail, RouterMatchDetail} from "../../../assets/Interface/Router";
import {betOnMatch} from "../../actions/login.actions";
import {GetDataService} from "../../service/get-data.service";

@Component({
  selector: 'app-match-detail-screen',
  templateUrl: './match-detail-screen.component.html',
  styleUrls: ['./match-detail-screen.component.scss']
})
export class MatchDetailScreenComponent implements OnInit {
  match: number = -1;
  betEnable = false;
  alreadyBetted: number | null = null;
  betting = {
    home: '',
    guest: '',
    coins: ''
  }

  data: MatchOverview | null = null;

  account: Login | null = null;
  accountSubscription = this.store.pipe(select(state => {
    return state
  }));


  constructor(private router: Router, private service: MatchService, private store: Store, private service2: GetDataService) {
    let state = this.router.getCurrentNavigation()?.extras.state;
    if (state != undefined && state.hasOwnProperty("data")) {
      this.match = state.data
    }
  }

  ngOnInit(): void {
    this.service.getMatchDetails(this.match).subscribe(val => {
      this.data = val;
    });

    this.accountSubscription.subscribe(res => {
      // @ts-ignore
      this.account = res['accounts']['loginUser']
      if (this.account) {
        this.service2.getBet(this.match, this.account.backendAPI).subscribe(val => {
            if (val) {
              this.betting.home = val.homegoal.toString();
              this.betting.guest = val.guestGoal.toString();
              this.betting.coins = val.value.toString();
              this.alreadyBetted = val.id;
            }
          }
        )
      }
    })
  }

  getStartDate(): string {
    if (this.data) {
      const date = new Date(this.data.start);
      return date.getDate() + '.' + date.getMonth() + '.' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes() + ' Uhr';
    }
    return ''
  }

  bet() {
    if (!isNaN(parseInt(this.betting.guest)) && !isNaN(parseInt(this.betting.home)) &&
      !isNaN(parseInt(this.betting.coins))) {
      const home: number = parseInt(this.betting.home);
      const guest: number = parseInt(this.betting.guest);
      const coins: number = parseInt(this.betting.coins);
      if (home > 0 && guest > 0 && this.account && coins <= this.account.coins) {
        const bet: MatchBet = {
          home: home,
          guest: guest,
          oldValue: this.account.coins,
          value: coins,
          match: this.match,
          apiKey: this.account.backendAPI
        }
        this.store.dispatch(betOnMatch({bet: bet}));
        this.betEnable = false;
      }
    }
  }

  deleteBet() {
    if (this.alreadyBetted) {
      this.service2.deleteBet(this.alreadyBetted).subscribe(val => {
        this.betEnable=false;
        this.alreadyBetted = null;
        this.betting.coins = '';
        this.betting.home = '';
        this.betting.guest = '';
      })

    }
  }

  goToClub(club: number) {
    if (this.data) {
      let id: ClubDetail = {
        id: -1,
        logoUrl: '',
        name: ''
      }
      if (club < 0) {
        id.id = this.data.club1.id;
        id.logoUrl = this.data.club1.logoURL;
        id.name = this.data.club1.name
      } else {
        id.id = this.data.club2.id;
        id.logoUrl = this.data.club2.logoURL;
        id.name = this.data.club2.name
      }

      this.router.navigateByUrl('club', {state: id});
    }
  }

}
