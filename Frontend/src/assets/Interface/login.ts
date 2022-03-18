export interface LoginRegisterData {
    password:string,
    eMail:string,
}
export interface LoginDataInter {
  backendAPI:string|null,
  name:string|null,
  coins:number|null
}
export interface ExtLoginRegister {
  fieldCount: number;
  affectedRows: number,
  insertId: number,
  serverStatus: number,
  warningCount: number,
  message: string,
  protocol41: boolean,
  changedRows: number
}

