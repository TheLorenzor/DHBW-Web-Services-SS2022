import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GetDataService {

  constructor() { }

  getLogin():Observable<{}> {
    return new Observable;
  }
}
