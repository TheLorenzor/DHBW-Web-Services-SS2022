import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {LoginDataInter, LoginRegisterData} from "../../assets/Interface/login";

@Injectable({
  providedIn: 'root'
})
export class GetDataService {

  constructor() { }

  login(data:LoginRegisterData):Observable<LoginDataInter> {
    return new Observable;
  }
}
