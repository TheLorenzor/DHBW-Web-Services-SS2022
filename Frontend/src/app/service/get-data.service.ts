import {Injectable} from '@angular/core';
import {catchError, map, Observable} from 'rxjs';
import {ExtGetMoney, ExtLogin, ExtRegister, LoginRegisterData} from "../../assets/Interface/login";
import {HttpClient} from "@angular/common/http";
import {Login} from "../../assets/Interface/state";
import {Store} from "@ngrx/store";
import {changeMoneyValue} from "../actions/login.actions";

@Injectable({
  providedIn: 'root'
})
export class GetDataService {

  url = 'http://localhost:8080/';

  constructor(private http: HttpClient,private store:Store) {
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

  placeBet(home:number,guest:number,apiKey:string,idGame:number,bettingValue:number):Observable<boolean> {
    return new Observable<boolean>();
  }

  getCoins(amount:number,apikey:string):Observable<any> {
    return this.http.get(this.url+'sendMoney/'+apikey+'/'+amount).pipe(
      map(res=>{
        const money:ExtGetMoney[] = res as ExtGetMoney[];
        this.store.dispatch(changeMoneyValue({newValue:money[0].bankaccount}));
        return true;
      },catchError((err) => {
        return new Observable<boolean>().pipe(map(res=> {
          return false;
        }));
      }))
    )
  }
  getRealMoney(amount:number,apiKey:string) {
    return this.http.get(this.url+'receiveMoney/'+apiKey+'/'+amount).pipe(
      map(res=>{
        const money:ExtGetMoney[] = res as ExtGetMoney[];
        this.store.dispatch(changeMoneyValue({newValue:money[0].bankaccount}));
        return true;
      },catchError((err) => {
        return new Observable<boolean>().pipe(map(res=> {
          return false;
        }));
      }))
    )
  }
}
