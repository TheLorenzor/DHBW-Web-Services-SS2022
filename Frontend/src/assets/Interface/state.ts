export interface StoreState {
  loginUser:Login|null;
  error:number|null
}

export interface Login {
  backendAPI:string;
  coins:number;
  email:string;
  passwordLength:number;
}
