import {Component, OnInit} from '@angular/core';
import {Login} from "../../../assets/Interface/state";
import {select, Store} from "@ngrx/store";
import {Router} from "@angular/router";
import {GetDataService} from "../../service/get-data.service";
import {Bet} from "../../../assets/Interface/match";

@Component({
  selector: 'app-login-settings',
  templateUrl: './login-settings.component.html',
  styleUrls: ['./login-settings.component.scss']
})
export class LoginSettingsComponent implements OnInit {
  accountData: Login | null = null;
  bets: Bet[] = [];
  accountSubscription = this.store.pipe(select(state => {
    return state
  }));
  displayedColumns: string[] = ['spiel_id', 'home', 'guest', 'value']

  constructor(private store: Store, private route: Router, private service: GetDataService) {
  }

  ngOnInit(): void {
    this.accountSubscription.subscribe(res => {
      // @ts-ignore
      this.accountData = res['accounts']['loginUser']
      if (this.accountData == null) {
        this.route.navigateByUrl('');
      } else {
        this.service.getAllBets("1").subscribe(val => {
          if (val) {
            this.bets = val;
          }
        })
      }

    })
  }

  changePassword(old: string, newP: string, retnew: string) {
    if (this.accountData) {
      if (old === this.accountData.password && newP === retnew && newP != old) {

      }
    }
  }

}
