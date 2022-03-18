import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import {select, Store} from "@ngrx/store";
import {getNewLoginData} from "./selector/login.selector";
import {map, Observable} from "rxjs";
import {Login} from "../assets/Interface/state";

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
      console.log(this.accountData)
    })
  }


  navigateToPerson() {
    if(localStorage.getItem('backendAPI')) {
      console.log(localStorage.getItem('backendAPI'))
      this.accountInfo.showScreen = !this.accountInfo.showScreen
    } else {
      this.route.navigateByUrl('login')
    }
  }
  changeCoins() {
    if (localStorage.getItem('backendAPI')) {
      this.route.navigateByUrl('coin-market')
    }

  }
  logout() {
    localStorage.removeItem('backendAPI');
    this.accountInfo.showScreen=false;
    this.coins=undefined;
    this.route.navigateByUrl('');
  }
  navigateSettings(){
      this.route.navigateByUrl('settings');
  }

}
