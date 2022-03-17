import {createAction, props} from "@ngrx/store";
import { LoginRegisterData} from "../../assets/Interface/login";
import {Login} from "../../assets/Interface/state";


export const loadLoginData=createAction(
  "[app Compomnent] loadLoginData",
  props<{sentData:LoginRegisterData}>()
);
export const loadLoginDataSuccess = createAction(
  "[app component] loadLoginDataSuccess",
  props<{loginData:Login}>()
);
