import {createAction, props} from "@ngrx/store";
import { LoginRegisterData} from "../../assets/Interface/login";
import {Login} from "../../assets/Interface/state";


export const register=createAction(
  "[app Compomnent] register",
  props<{sentData:LoginRegisterData}>()
);
export const registerSuccess = createAction(
  "[app component] registerSuccess",
  props<{loginData:Login}>()
);
export const registerFailure = createAction(
  "[app component] registerFailure",
);

export const login = createAction(
  "[login-register] login",
  props<{logindata:LoginRegisterData}>()
)

export const changeLoginData=createAction(
  "[settings] changeLoginData",
  props<{newLogin:LoginRegisterData}>()
);

export const logout=createAction(
  "[app component] logout"
)
export const changeMoneyValue = createAction(
  "[misc] changeValue",
  props<{newValue:number}>()
)
export const changePassword = createAction(
  "[settings] changePassword",
  props<{password:string,login:Login}>()
)
