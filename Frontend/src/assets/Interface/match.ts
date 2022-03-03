export interface MatchOverview {
  id:number;
  club1: {
    points:number;
    name:string;
    logoURL:string;
    goals:Goaler[]|null;
  };
  club2: {
    points:number;
    name:string;
    logoURL:string;
    goals:Goaler[]|null;
  };
}
export interface Goaler {
  name:string;
  minute:number;
  points:number|null;
}
