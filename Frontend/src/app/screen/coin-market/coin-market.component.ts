import { Component, OnInit } from '@angular/core';
import {Login} from "../../../assets/Interface/state";
import {select, Store} from "@ngrx/store";
import {Router} from "@angular/router";

@Component({
  selector: 'app-coin-market',
  templateUrl: './coin-market.component.html',
  styleUrls: ['./coin-market.component.scss']
})
export class CoinMarketComponent implements OnInit {
  turnIn = true;
  accountData:Login|null = null;
  accountSubscription =this.store.pipe(select(state => {
    return state
  }));
  constructor(private store:Store,private router:Router) { }

  ngOnInit(): void {
    this.accountSubscription.subscribe(res=>{
      // @ts-ignore
      this.accountData = res['accounts']['loginUser'];
      /*if (!this.accountData) {
        this.router.navigateByUrl('');
      }*/
    })
  }

}
