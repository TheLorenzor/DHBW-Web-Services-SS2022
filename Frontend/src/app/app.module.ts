import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeScreenComponent } from './screen/home/home-screen.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from "@angular/material/button";
import { MatchComponent } from './components/home/match/match.component';
import { MatchDetailScreenComponent } from './screen/match-detail-screen/match-detail-screen.component';
import {Router, RouterModule} from "@angular/router";
import {MatCardModule} from "@angular/material/card";
import { AllMatchesComponent } from './screen/all-matches/all-matches.component';
@NgModule({
  declarations: [
    AppComponent,
    HomeScreenComponent,
    MatchComponent,
    MatchDetailScreenComponent,
    AllMatchesComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatToolbarModule,
        MatButtonModule,
        MatCardModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
