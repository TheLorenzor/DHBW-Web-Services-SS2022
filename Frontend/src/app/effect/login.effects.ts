import {Injectable} from "@angular/core";
import {GetDataService} from "../service/get-data.service";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {loadLoginData} from "../actions/login.actions";

@Injectable()
export class LoginEffects {
  constructor(private $actions:Actions,private service:GetDataService) {
  }
  loadLoginData$ = createEffect(()=>this.$actions.pipe(
    ofType(loadLoginData)
  ))

}
