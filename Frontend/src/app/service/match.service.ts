import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {filter, map, Observable} from "rxjs";
import {ExternMatch, Liga, LigaExtern, MatchOverview} from "../../assets/Interface/match";

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
      const arr = res['results'] as ExternMatch[];
      let finalArray:MatchOverview[] = [];
      for (let i=0;i<arr.length;++i) {
        finalArray.push({
          id:arr[i].id,
          start: arr[i].startzeitpunkt,
          inorderId:i,
          spieltag: arr[i].spieltag,
          club1: {
            goals: null,
            name:arr[i].heimverein,
            id:arr[i].heimverein_id,
            logoURL:arr[i].heimlogo,
            points:arr[i].heim_points
          },
            club2: {
              goals: null,
              id:arr[i].gastverein_id,
              name:arr[i].gastverein,
              logoURL:arr[i].gastlogo,
              points:arr[i].gast_points
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
          id:liga.id
        } as Liga;
      })
    }));
  }

}
