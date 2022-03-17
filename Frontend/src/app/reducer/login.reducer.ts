import { StoreState} from "../../assets/Interface/state";
import {createReducer, on} from "@ngrx/store";
import {loadLoginDataSuccess} from "../actions/login.actions";


export const initialState:StoreState = {
  loginUser:null
}


export const accounts = createReducer(
  initialState,
  on(loadLoginDataSuccess,(state,action) => ({loginUser: action.loginData}))
);
