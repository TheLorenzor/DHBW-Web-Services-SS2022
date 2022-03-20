import { Component, OnInit } from '@angular/core';
import {Login} from "../../../assets/Interface/state";
import {select, Store} from "@ngrx/store";
import {Router} from "@angular/router";
import {GetDataService} from "../../service/get-data.service";

@Component({
  selector: 'app-login-settings',
  templateUrl: './login-settings.component.html',
  styleUrls: ['./login-settings.component.scss']
})
export class LoginSettingsComponent implements OnInit {
  change = {
    show:false
  }
  accountData:Login|null = null;
  accountSubscription =this.store.pipe(select(state => {
    return state
  }));

  constructor(private store:Store,private route:Router,private service:GetDataService){ }

  ngOnInit(): void {
    this.accountSubscription.subscribe(res=>{
      // @ts-ignore
      this.accountData = res['accounts']['loginUser']
    })
  }
  changePassword(old:string,newP:string,retnew:string) {
    if (this.accountData) {
      if (old === this.accountData.password && newP===retnew &&newP!=old) {

      }
    }
  }

}
