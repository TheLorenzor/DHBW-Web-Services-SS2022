import {Injectable} from '@angular/core';
import {catchError, map, Observable} from 'rxjs';
import {ExtGetMoney, ExtLogin, ExtRegister, LoginRegisterData} from "../../assets/Interface/login";
import {HttpClient} from "@angular/common/http";
import {Login} from "../../assets/Interface/state";
import {Store} from "@ngrx/store";
import {changeMoneyValue} from "../actions/login.actions";
import {Bet} from "../../assets/Interface/match";

@Injectable({
  providedIn: 'root'
})
export class GetDataService {

  url = 'http://localhost:8080/';

  constructor(private http: HttpClient, private store: Store) {
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
                password: data.password,
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
          const dat: ExtLogin = res as ExtLogin;
          return {
            password: data.password,
            email: data.eMail,
            coins: dat.results[0].Kontostand,
            backendAPI: dat.results[0].id.toString()
          } as Login
        } else {
          return null;
        }
      }));
    }

  }

  placeBet(home: number, guest: number, apiKey: string, idGame: number, bettingValue: number): Observable<boolean> {
    return this.http.get(this.url + 'placeBet/' + home + '/' + guest + '/' + apiKey + '/' + idGame + '/' + bettingValue + '/3')
      .pipe(map(res => {
        // @ts-ignore
        if (res.hasOwnProperty('message') && res['message'] == "new bet created") {
          console.log(res);
          return true;
        }
        return false;
      }));
  }

  getBet(matchid: number, apiKey: string): Observable<null | Bet> {
    return this.http.get(this.url + 'getSingleBet/' + apiKey + '/' + matchid)
      .pipe(
        map(res => {
          if (res) {
            const bet: Bet[] = res as Bet[];
            return bet[0]
          }
          return null;
        })
        , catchError(() => {
          return new Observable().pipe(map(() =>null))
        })
      )
  }
  deleteBet(betId:number):Observable<boolean> {
    return this.http.get(this.url+'deleteBet/'+betId).pipe(
      map(res=>{
        if (res) {
          return true;
        }
        return false;
      }),
      catchError(()=>{
        return new Observable().pipe(map(()=>false))
      })
    )
  }

  updateBet() {

  }

  getCoins(amount: number, apikey: string): Observable<any> {
    return this.http.get(this.url + 'sendMoney/' + apikey + '/' + amount).pipe(
      map(res => {
        const money: ExtGetMoney[] = res as ExtGetMoney[];
        this.store.dispatch(changeMoneyValue({newValue: money[0].Kontostand}));
        return true;
      }, catchError((err) => {
        return new Observable<boolean>().pipe(map(res => {
          return false;
        }));
      }))
    )
  }

  getRealMoney(amount: number, apiKey: string) {
    return this.http.get(this.url + 'receiveMoney/' + apiKey + '/' + amount).pipe(
      map(res => {
        const money: ExtGetMoney[] = res as ExtGetMoney[];
        this.store.dispatch(changeMoneyValue({newValue: money[0].Kontostand}));
        return true;
      }, catchError(() => {
        return new Observable<boolean>().pipe(map(() => {
          return false;
        }));
      }))
    )
  }

  updatePassword(newP: string, login: Login): Observable<null | Login> {
    return this.http.get(this.url + '').pipe(
      map((res) => {
        return null;
      })
    )
  }
}
