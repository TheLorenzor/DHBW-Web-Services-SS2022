export interface MatchOverview {
  id:number;
  start:Date;
  club1: {
    points:number|null;
    name:string;
    id:number;
    logoURL:string|null;
    goals:Goaler[]|null;
  };
  club2: {
    points:number|null;
    name:string;
    id:number;
    logoURL:string|null;
    goals:Goaler[]|null;
  };
}
export interface Goaler {
  name:string;
  minute:number;
  points:number|null;
}

export interface externMatch {
  heimverein_id:number,
  gastverein_id:number,
  heimverein:string,
  gastverein:string,
  ergebnis:string|null,
  saison:string,
  spieltag:number,
  startzeitpunkt:Date
}
