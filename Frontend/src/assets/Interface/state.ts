export interface StoreState {
  loginUser:Login|null;
}

export interface Login {
  backendAPI:string;
  coins:number;
  email:string;
  passwordLength:number;
}
