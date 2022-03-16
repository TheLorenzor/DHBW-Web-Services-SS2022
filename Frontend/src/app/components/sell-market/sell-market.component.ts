import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, Validators} from "@angular/forms";

@Component({
  selector: 'app-sell-market',
  templateUrl: './sell-market.component.html',
  styleUrls: ['./sell-market.component.scss']
})
export class SellMarketComponent implements OnInit {
  inEuros: number | null=null;

   euroForm = new FormControl('',[
     Validators.required,
     Validators.pattern("^[0-9]*$")
   ])

  constructor() {
  }

  ngOnInit(): void {
     this.euroForm.valueChanges.subscribe(res=>{
       console.log(res)
       if (res && !isNaN(res)) {
         this.inEuros=res/2;
       } else {
         this.inEuros = null;
       }
     })
  }


}

