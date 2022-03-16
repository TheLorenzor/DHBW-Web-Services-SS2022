import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Frontend';
  coins:number|undefined = undefined;
  accountInfo = {
    showScreen: false,
    name:"Test"

  }
  constructor(private route:Router) {

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
