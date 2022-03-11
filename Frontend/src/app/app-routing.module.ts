import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeScreenComponent} from "./screen/home/home-screen.component";
import {MatchDetailScreenComponent} from "./screen/match-detail-screen/match-detail-screen.component";
import {AllMatchesComponent} from "./screen/all-matches/all-matches.component";

const routes: Routes = [
  {path:'',component:HomeScreenComponent},
  {path:'match',component:MatchDetailScreenComponent, data:{}},
  {path:'basketball',component:AllMatchesComponent,data:{typeSport:"basketball"}},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
