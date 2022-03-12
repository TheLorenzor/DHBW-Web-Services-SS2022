import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login-register',
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.scss']
})
export class LoginRegisterComponent implements OnInit {
  hide:boolean;
  isregister:boolean=false;
  constructor(private route:Router,private aRouter:ActivatedRoute) { 
    this.hide = true;
  }
  
  ngOnInit(): void {
    console.log(this.aRouter.snapshot.queryParams)
  }

}