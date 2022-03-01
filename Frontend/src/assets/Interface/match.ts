export interface MatchOverview {
  club1: {
    points:number;
    name:string;
    logoURL:string;
    goals:Goaler[]|null;
  }
  club2: {

  }
}
export interface Goaler {
  name:string;
  minute:number;
  points:number|null;
}
