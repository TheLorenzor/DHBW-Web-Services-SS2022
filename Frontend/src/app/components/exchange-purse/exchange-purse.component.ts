import { Component, OnInit } from '@angular/core';
import {select, Store} from "@ngrx/store";
import {GetDataService} from "../../service/get-data.service";
import {Login} from "../../../assets/Interface/state";
import {Router} from "@angular/router";

@Component({
  selector: 'app-exchange-purse',
  templateUrl: './exchange-purse.component.html',
  styleUrls: ['./exchange-purse.component.scss']
})
export class ExchangePurseComponent implements OnInit {

  accountData:Login|null = null;
  accountSubscription =this.store.pipe(select(state => {
    return state
  }));

  constructor(private store:Store,private service:GetDataService,private router:Router) { }

  ngOnInit(): void {
    this.accountSubscription.subscribe(res=>{
      // @ts-ignore
      this.accountData = res['accounts']['loginUser'];
    })
  }
  getCoins(amount:number) {
    if (this.accountData) {
      this.service.getCoins(amount,this.accountData.backendAPI).subscribe();
    }

  }


}
