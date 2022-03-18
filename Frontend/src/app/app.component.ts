import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import {select, Store} from "@ngrx/store";
import {Login} from "../assets/Interface/state";
import {logout} from "./actions/login.actions";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'Frontend';
  coins:number|undefined = undefined;
  accountInfo = {
    showScreen: false,
    name:"Test"

  }
  accountData:Login|null = null;
  accountSubscription =this.store.pipe(select(state => {
    return state
  }));

  constructor(private route:Router,private store:Store) {
  }


  ngOnInit(): void {
    this.accountSubscription.subscribe(res=>{
      // @ts-ignore
      this.accountData = res['accounts']['loginUser']
    })
  }


  navigateToPerson() {
    if(this.accountData) {
      this.accountInfo.showScreen = !this.accountInfo.showScreen
    } else {
      this.route.navigateByUrl('login')
    }
  }
  changeCoins() {
    if (this.accountData) {
      this.route.navigateByUrl('coin-market')
    }

  }
  logoutButton() {
    //TODO: logout finishing
    this.store.dispatch(logout())
    this.accountInfo.showScreen=false;
    this.route.navigateByUrl('');
  }
  navigateSettings(){
      this.route.navigateByUrl('settings');
  }

}
