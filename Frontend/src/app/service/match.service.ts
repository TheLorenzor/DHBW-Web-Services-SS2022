import { Injectable } from '@angular/core';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {externMatch, MatchOverview} from "../../assets/Interface/match";

@Injectable({
  providedIn: 'root'
})
export class MatchService {
  url = "http://localhost:8080/";
  header = {
    'Access-Control-Allow-Origin':''
  }
  constructor(private http:HttpClient) { }

  getHomeMatched():Observable<MatchOverview[]|null> {
    return this.http.get(this.url+'home',{headers:this.header}).pipe(map(res=>{
      console.log(res);
      return null;
    }))
  }
}
