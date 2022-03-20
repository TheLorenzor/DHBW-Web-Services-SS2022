import {createSelector} from "@ngrx/store";
import {StoreState} from "../../assets/Interface/state";



export const selectLogin = (state:StoreState) =>state;


export const getNewLoginData = createSelector(
  selectLogin,
  (state) =>state.loginUser
)
