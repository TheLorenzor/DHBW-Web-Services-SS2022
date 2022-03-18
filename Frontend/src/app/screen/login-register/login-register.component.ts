import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginRegisterData } from 'src/assets/Interface/login';
import {Store} from "@ngrx/store";
import {register} from "../../actions/login.actions";

@Component({
  selector: 'app-login-register',
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.scss']
})
export class LoginRegisterComponent implements OnInit {
  hide:boolean;
  isregister:boolean=false;
  dataLogin:LoginRegisterData = {
    password: "",
    eMail:""
  }
  dataRegister = {
    password:"",
    eMail: "",
    retypedPassword:''
  }

  constructor(private route:Router,private aRouter:ActivatedRoute,private store:Store) {
    this.hide = true;
  }

  ngOnInit(): void {
  }
  login():void {
    if (this.dataLogin.eMail.length>0 &&this.dataLogin.password.length>0) {
    }

  }

  register() {
    if (this.dataRegister.retypedPassword===this.dataRegister.password&&this.dataRegister.eMail.length>3&&this.dataRegister.eMail.indexOf('@')>0) {
      let data:LoginRegisterData = {
        password: this.dataRegister.password,
        eMail:this.dataRegister.eMail
      }
      this.store.dispatch(register({sentData:data}));
      this.route.navigateByUrl('')
    }
  }

}
