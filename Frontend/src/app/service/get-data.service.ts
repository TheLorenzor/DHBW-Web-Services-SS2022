import {Injectable} from '@angular/core';
import {catchError, map, Observable} from 'rxjs';
import {ExtLogin, ExtRegister, LoginRegisterData} from "../../assets/Interface/login";
import {HttpClient} from "@angular/common/http";
import {Login} from "../../assets/Interface/state";
import {renderFlagCheckIfStmt} from "@angular/compiler/src/render3/view/template";

@Injectable({
  providedIn: 'root'
})
export class GetDataService {

  url = 'http://localhost:8080/';

  constructor(private http: HttpClient) {
  }

  registerLogin(data: LoginRegisterData, type: string): Observable<Login | null> {
    if (type === 'register') {
      return this.http
        .get(this.url + 'register/email=' + data.eMail + '/passwordHash=' + data.password)
        .pipe(
          map(res => {
            if ('insertId' in res) {
              const extData: ExtRegister = res as ExtRegister
              const t: Login = {
                passwordLength: data.password?.length ? data.password?.length : -1,
                backendAPI: extData.insertId.toString(),
                email: data.eMail,
                coins: 0
              }
              return t;
            } else {
              return null;
            }

          }), catchError(() => {
            return new Observable().pipe(map(res => {
              return null;
            }));
          }));
    } else {
      return this.http.get(this.url + 'Vlogin/email=' + data.eMail + '/passwordHash=' + data.password).pipe(map(res => {
        if ('results' in res) {
          const dat:ExtLogin = res as ExtLogin;
          return {
            passwordLength: data.password.length,
            email:data.eMail,
            coins:dat.results[0].bankaccount,
            backendAPI:dat.results[0].id.toString()
          } as Login
        } else {
          return null;
        }
      }));
    }

  }
}
