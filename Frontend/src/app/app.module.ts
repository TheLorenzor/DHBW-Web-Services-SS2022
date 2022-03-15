import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {MatIconModule} from '@angular/material/icon';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeScreenComponent } from './screen/home/home-screen.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from "@angular/material/button";
import { MatchComponent } from './components/home/match/match.component';
import { MatchDetailScreenComponent } from './screen/match-detail-screen/match-detail-screen.component';
import { RouterModule } from '@angular/router';
import {MatCardModule} from "@angular/material/card";
import { AllMatchesComponent } from './screen/all-matches/all-matches.component';
import { LoginRegisterComponent } from './screen/login-register/login-register.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import { CoinMarketComponent } from './screen/coin-market/coin-market.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

@NgModule({
  declarations: [
    AppComponent,
    HomeScreenComponent,
    MatchComponent,
    MatchDetailScreenComponent,
    AllMatchesComponent,
    LoginRegisterComponent,
    CoinMarketComponent,

  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatToolbarModule,
        MatButtonModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        FormsModule,
        MatInputModule,
        RouterModule,
        StoreModule.forRoot({}, {}),
        EffectsModule.forRoot([])
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
