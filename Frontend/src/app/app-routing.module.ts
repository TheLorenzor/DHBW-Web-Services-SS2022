import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeScreenComponent} from "./screen/home/home-screen.component";
import {MatchDetailScreenComponent} from "./screen/match-detail-screen/match-detail-screen.component";
import {AllMatchesComponent} from "./screen/all-matches/all-matches.component";
import { LoginRegisterComponent } from './screen/login-register/login-register.component';

const routes: Routes = [
  {path:'',component:HomeScreenComponent},
  {path:'match',component:MatchDetailScreenComponent, data:{}},
  {path:'football',component:AllMatchesComponent,data:{typeSport:"football"}},
  {path:'login',component:LoginRegisterComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
