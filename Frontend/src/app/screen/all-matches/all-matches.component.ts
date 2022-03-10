import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-all-matches',
  templateUrl: './all-matches.component.html',
  styleUrls: ['./all-matches.component.scss']
})
export class AllMatchesComponent implements OnInit {
  typeMatch:string="";

  constructor(private route:ActivatedRoute, private router:Router) {
    this.typeMatch = route.snapshot.data['typeSport'];
    console.log(this.typeMatch)
  }

  ngOnInit(): void {
  }

}
