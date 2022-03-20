import {Login, StoreState} from "../../assets/Interface/state";
import {createReducer, on} from "@ngrx/store";
import {changeMoneyValue, logout, registerFailure, registerSuccess} from "../actions/login.actions";


export const initialState:StoreState = {
  loginUser:null,
  error:null
}


export const accounts = createReducer(
  initialState,
  on(registerSuccess,(state,action) => (
    {loginUser: action.loginData,error: state.error})),
  on(registerFailure,(state)=>(
    {loginUser: state.loginUser,error: 1})),
  on(logout,()=>({loginUser: null,error: null})),
  on(changeMoneyValue, (state,action) => {
    const login:Login = state.loginUser as Login;
    const data:Login = {
      coins:action.newValue,
      passwordLength:login.passwordLength,
      backendAPI:login.backendAPI,
      email:login.email
    }
    return {loginUser: data ,error: null};
  })
);
