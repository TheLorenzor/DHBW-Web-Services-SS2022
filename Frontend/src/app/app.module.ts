import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {MatIconModule} from '@angular/material/icon';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeScreenComponent } from './screen/home/home-screen.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from "@angular/material/button";
import { MatchComponent } from './components/match/match.component';
import { MatchDetailScreenComponent } from './screen/match-detail-screen/match-detail-screen.component';
import { RouterModule } from '@angular/router';
import {MatCardModule} from "@angular/material/card";
import { AllMatchesComponent } from './screen/all-matches/all-matches.component';
import { LoginRegisterComponent } from './screen/login-register/login-register.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import { CoinMarketComponent } from './screen/coin-market/coin-market.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { ExchangePurseComponent } from './components/exchange-purse/exchange-purse.component';
import {HttpClientModule} from "@angular/common/http";
import { SellMarketComponent } from './components/sell-market/sell-market.component';
import { LoginSettingsComponent } from './screen/login-settings/login-settings.component';
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatDatepickerModule} from "@angular/material/datepicker";
import { MatNativeDateModule } from '@angular/material/core';
import {accounts} from "./reducer/login.reducer";
import {LoginEffects} from "./effect/login.effects";
import { ClubComponent } from './screen/club/club.component';
import {MatTableModule} from "@angular/material/table";

@NgModule({
  declarations: [
    AppComponent,
    HomeScreenComponent,
    MatchComponent,
    MatchDetailScreenComponent,
    AllMatchesComponent,
    LoginRegisterComponent,
    CoinMarketComponent,
    ExchangePurseComponent,
    SellMarketComponent,
    LoginSettingsComponent,
    ClubComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    HttpClientModule,
    FormsModule,
    MatInputModule,
    RouterModule,
    StoreModule.forRoot({accounts}, {}),
    EffectsModule.forRoot([LoginEffects]),
    MatProgressBarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
