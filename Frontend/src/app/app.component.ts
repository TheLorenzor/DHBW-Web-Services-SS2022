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
  constructor(private route:Router) {

  }
  navigateToPerson() {
    this.route.navigateByUrl('login');
  }
  changeCoins() {
    if (localStorage.getItem('backendAPI')!=undefined) {

    } else {

    }
  }
}
