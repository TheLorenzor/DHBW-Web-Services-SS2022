import { Injectable } from '@angular/core';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {externMatch, Goaler, MatchOverview} from "../../assets/Interface/match";

@Injectable({
  providedIn: 'root'
})
export class MatchService {
  url = "http://localhost:8080/";
  header = {
    'Access-Control-Allow-Origin':''
  }
  constructor(private http:HttpClient) { }

  getHomeMatched():Observable<MatchOverview[]> {
    return this.http.get(this.url+'home',{headers:this.header}).pipe(map(res=>{
      // @ts-ignore
      const arr = res['results'] as externMatch[];
      let finalArray:MatchOverview[] = [];
      for (let i=0;i<arr.length;++i) {
        finalArray.push({
          id:i,
          start: arr[i].startzeitpunkt,
          club1: {
            goals: null,
            name:arr[i].heimverein,
            id:arr[i].heimverein_id,
            logoURL:null,
            points:null
          },
            club2: {
              goals: null,
              id:arr[i].gastverein_id,
              name:arr[i].gastverein,
              logoURL:null,
              points:null
            }
        } as MatchOverview);
      }
    return finalArray;

    }))
  }
}
