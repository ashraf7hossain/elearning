import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { SiteService } from 'src/app/services/site.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(
    private _auth: AuthService,
    private router: Router,
    private _site: SiteService
  ) {}

  credential:string  = "";
  warning: any = {
    email: false,
    pass: false
  }

  ngOnInit(): void {
    if(localStorage.getItem('token')!==null){
      this.router.navigate(['dashboard']);
    }
  }

  Login(form: any) {
    const { email, password } = form.value;
    if(email === "" || password === ""){
      this.warning.email = email === "";
      this.warning.pass = password === "";
      return;
      
    }
    
    this._auth.Login(email, password);
    this._auth.currentCredential.subscribe((res) => {
      this.credential = res;
    })
  }
}
