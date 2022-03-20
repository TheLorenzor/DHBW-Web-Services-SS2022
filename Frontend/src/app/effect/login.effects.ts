import {Injectable} from "@angular/core";
import {GetDataService} from "../service/get-data.service";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {
  betOnMatch, betOnMatchFailure,
  changeMoneyValue,
  changePassword,
  login,
  register,
  registerFailure,
  registerSuccess
} from "../actions/login.actions";
import {map, mergeMap} from "rxjs";
import {MatchBet} from "../../assets/Interface/match";

@Injectable()
export class LoginEffects {
  constructor(private $actions:Actions,private service:GetDataService) {
  }
  registerData$ = createEffect(()=>this.$actions.pipe(
    ofType(register),
    mergeMap((action)=>{
      return this.service.registerLogin(action.sentData,"register").pipe(
        map((loginData)=> {
          if (loginData) {
            return registerSuccess({loginData:loginData});
          } else {
            return registerFailure();
          }

        }));
    })));
  loginData$ = createEffect(()=>this.$actions.pipe(
    ofType(login),
    mergeMap((action)=>{
      return this.service.registerLogin(action.logindata,"login").pipe(
        map((loginData)=>{
          if (loginData) {
            return registerSuccess({loginData:loginData});
          } else {
            return registerFailure();
          }
        }));
    })));
  updatePassword$ =createEffect(()=>this.$actions.pipe(
    ofType(changePassword),
    mergeMap((action)=> {
      return this.service.updatePassword(action.password,action.login).pipe(
        map((loginData)=>{
          if (loginData) {
            return registerSuccess({loginData:loginData})
          }
          return registerFailure();
        })
      )
    })
  ))
  placeBet$ = createEffect(()=>this.$actions.pipe(
    ofType(betOnMatch),
    mergeMap((action)=>{
      const bett:MatchBet = action.bet;
      return this.service.placeBet(bett.home,bett.guest,bett.apiKey,bett.match,bett.value).pipe(
        map(res=>{
          if (res) {
            return changeMoneyValue({newValue:bett.oldValue-bett.value});
          }
          return betOnMatchFailure();
        })
      )
    })
  ))
}
