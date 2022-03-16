import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeScreenComponent} from "./screen/home/home-screen.component";
import {MatchDetailScreenComponent} from "./screen/match-detail-screen/match-detail-screen.component";
import {AllMatchesComponent} from "./screen/all-matches/all-matches.component";
import { LoginRegisterComponent } from './screen/login-register/login-register.component';
import {CoinMarketComponent} from "./screen/coin-market/coin-market.component";
import {LoginSettingsComponent} from "./screen/login-settings/login-settings.component";

const routes: Routes = [
  {path:'',component:HomeScreenComponent},
  {path:'match',component:MatchDetailScreenComponent, data:{}},
  {path:'football',component:AllMatchesComponent,data:{typeSport:"football"}},
  {path:'login',component:LoginRegisterComponent},
  {path:'coin-market',component:CoinMarketComponent},
  {path:'settings',component:LoginSettingsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
