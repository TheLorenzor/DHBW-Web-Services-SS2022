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
    showScreen: true,
    name:"Test"

  }
  constructor(private route:Router) {

  }
  navigateToPerson() {
    this.accountInfo.showScreen = !this.accountInfo.showScreen
    console.log(this.accountInfo.showScreen)
  }
  changeCoins() {
    if (localStorage.getItem('backendAPI')!=undefined) {
      const l = localStorage.getItem('backendAPI')
    } else {

    }
  }
}
