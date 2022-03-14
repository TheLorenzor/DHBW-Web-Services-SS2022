import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { loginRegisterData } from 'src/assets/Interface/login';

@Component({
  selector: 'app-login-register',
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.scss']
})
export class LoginRegisterComponent implements OnInit {

  hide:boolean;
  isregister:boolean=false;
  dataLogin:loginRegisterData = {
    password: "",
    eMail:""
  }

  constructor(private route:Router,private aRouter:ActivatedRoute) {
    this.hide = true;
  }

  ngOnInit(): void {
  }
  login():void {
    localStorage.setItem('backendAPI','123456');
    this.route.navigateByUrl('coin-market');
  }

}
