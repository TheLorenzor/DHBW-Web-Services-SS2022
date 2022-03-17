import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {filter, map, Observable} from "rxjs";
import {externMatch, Liga, LigaExtern, MatchOverview} from "../../assets/Interface/match";

@Injectable({
  providedIn: 'root'
})
export class MatchService {
  url = "http://localhost:8080/";
  header = {
    'Access-Control-Allow-Origin':''
  }
  constructor(private http:HttpClient) { }

  getMatches(id:number):Observable<MatchOverview[]> {
    let url = this.url;
    if (id<1) {
      url =url+'home'
    } else {
      url =url+'football/'+id
    }
    return this.http.get(url,{headers:this.header}).pipe(map(res=>{
      // @ts-ignore
      const arr = res['results'] as externMatch[];
      let finalArray:MatchOverview[] = [];
      for (let i=0;i<arr.length;++i) {
        finalArray.push({
          id:i,
          start: arr[i].startzeitpunkt,
          inorderId:i,
          spieltag: arr[i].spieltag,
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

    }));
  }

  getAllLiga():Observable<Liga[]> {
    return this.http.get(this.url+'football').pipe(map(res => {
      // @ts-ignore
      const list:LigaExtern[] = res['results'] as LigaExtern[];
      return list.map(liga=>{
        return {
          name:liga.name,
          id:-1
        } as Liga;
      })
    }));
  }

}
