export interface MatchOverview {
  id:number;
  inorderId:number;
  start:Date;
  spieltag:number;
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
  id:number;
  heim_points:number,
  gast_points:number,
  gastlogo:string,
  heimlogo:string,
  saison:string,
  spieltag:number,
  startzeitpunkt:Date
}

export interface Liga {
  name:string;
  id:number;
}
export interface LigaExtern {
  name:string;
  id:number;
}
