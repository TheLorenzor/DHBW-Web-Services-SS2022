import {Injectable} from "@angular/core";
import {GetDataService} from "../service/get-data.service";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {loadLoginData, loadLoginDataSuccess} from "../actions/login.actions";
import {map, mergeMap} from "rxjs";

@Injectable()
export class LoginEffects {
  constructor(private $actions:Actions,private service:GetDataService) {
  }
  loadLoginData$ = createEffect(()=>this.$actions.pipe(
    ofType(loadLoginData),
    mergeMap((action)=>{
      return this.service.login(action.sentData).pipe(
        map((loginData)=> {
          return loadLoginDataSuccess({loginData:loginData});
        }));

    })
  ))

}
