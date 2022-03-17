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

  getHomeMatched():Observable<MatchOverview[]|null> {
    return this.http.get(this.url+'home',{headers:this.header}).pipe(map(res=>{
      const arr = res as externMatch[];
      let finalArray:MatchOverview[] = [];
      for (let i=0;i<arr.length;++i) {

        finalArray.push({
          id:i,
          club1: {
            goals: null,
            name:arr[i].heimverein,
            id:arr[i].heimverein_id,
            logoURL:null,
            points:0
          },
            club2: {
              goals: null,
              id:arr[i].gastverein_id,
              name:arr[i].gastverein,
              logoURL:null,
              points:0
            }
        } as MatchOverview);
      }
      return finalArray;
    }))
  }
}
