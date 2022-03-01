import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeScreenComponent} from "./screen/home/home-screen.component";
import {MatchDetailScreenComponent} from "./screen/match-detail-screen/match-detail-screen.component";

const routes: Routes = [
  {path:'',component:HomeScreenComponent},
  {path:'match',component:MatchDetailScreenComponent, data:{}}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
