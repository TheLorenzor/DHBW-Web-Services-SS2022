import {Injectable} from "@angular/core";
import {GetDataService} from "../service/get-data.service";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {changePassword, login, register, registerFailure, registerSuccess} from "../actions/login.actions";
import {map, mergeMap} from "rxjs";

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
}
