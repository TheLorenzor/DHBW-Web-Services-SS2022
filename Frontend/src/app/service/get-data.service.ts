import { Injectable } from '@angular/core';
import {catchError, map, Observable} from 'rxjs';
import {ExtLoginRegister, LoginRegisterData} from "../../assets/Interface/login";
import {HttpClient} from "@angular/common/http";
import {Login} from "../../assets/Interface/state";

@Injectable({
  providedIn: 'root'
})
export class GetDataService {

  url = 'http://localhost:8080/';

  constructor(private http:HttpClient) { }

  registerLogin(data:LoginRegisterData,type:string):Observable<Login|null> {
    if (type=='register') {
      return this.http.get(this.url+'register/email='+data.eMail+'&passwordHash='+data.password).pipe(map(res => {
        if ('insertId' in res) {
          const extData:ExtLoginRegister = res as ExtLoginRegister
          const t:Login = {
            passwordLength:data.password?.length?data.password?.length:-1,
            backendAPI: extData.insertId.toString(),
            email:data.eMail,
            coins:0
          }
          return t;
        } else {
          return null;
        }

      }),catchError(() => {
        return new Observable().pipe(map(res=>{
          return null;
        }));
      }));
    } else {
      return this.http.get(this.url+'Vlogin/email='+data.eMail+'/passwordHash='+data.password).pipe(map(res=>{
        return {

        } as Login;
      }));
    }

  }
}
