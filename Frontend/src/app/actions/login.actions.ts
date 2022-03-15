import {createAction, props} from "@ngrx/store";
import {LoginDataInter, LoginRegisterData} from "../../assets/Interface/login";


export const loadLoginData=createAction(
  "[app Compomnent] loadLoginData",
  props<{sentData:LoginRegisterData}>()
);
export const loadLoginDataSuccess = createAction(
  "[app component] loadLoginDataSuccess",
  props<{loginData:LoginDataInter}>()
);
