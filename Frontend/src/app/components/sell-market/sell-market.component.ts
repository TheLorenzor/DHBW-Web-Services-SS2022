import { Component, OnInit } from '@angular/core';
import { FormControl, Validators} from "@angular/forms";
import {GetDataService} from "../../service/get-data.service";
import {Login} from "../../../assets/Interface/state";
import {select, Store} from "@ngrx/store";
import {changeMoneyValue} from "../../actions/login.actions";

@Component({
  selector: 'app-sell-market',
  templateUrl: './sell-market.component.html',
  styleUrls: ['./sell-market.component.scss']
})
export class SellMarketComponent implements OnInit {
  inEuros: number | null=null;

   euroForm = new FormControl('',[
     Validators.required,
     Validators.pattern("^[0-9]*$")
   ])
  accountData:Login|null = null;
  accountSubscription =this.store.pipe(select(state => {
    return state
  }));

  constructor(private service:GetDataService,private store:Store) {
  }

  ngOnInit(): void {
     this.euroForm.valueChanges.subscribe(res=>{
       if (res && !isNaN(res)) {
         this.inEuros=res/2;
       } else {
         this.inEuros = null;
       }
     })
    this.accountSubscription.subscribe(res=>{
      // @ts-ignore
      this.accountData = res['accounts']['loginUser']
    })
  }
  payOut() {
    if (this.inEuros&&this.inEuros>250) {
      if (this.accountData&& this.accountData.coins>=this.inEuros*2) {
        this.euroForm.reset();
        this.service.getRealMoney(this.inEuros,this.accountData.backendAPI);
      }


    }
  }


}

