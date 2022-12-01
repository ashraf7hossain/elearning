import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

import { pipe, map, BehaviorSubject } from 'rxjs';
import { SiteService } from './site.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private _site: SiteService,
    private router: Router
  ) {}

  private wrongCredential = new BehaviorSubject<string>("");
  navBar = new BehaviorSubject<boolean>(false);

  currentCredential = this.wrongCredential.asObservable();
  currentNavBar = this.navBar.asObservable();

  Login(email: string, password: string): any {
    let form = new FormData();
    form.append('moodlewsrestformat', 'json');
    form.append('username', email);
    form.append('password', password);
    form.append('service', 'moodle_mobile_app');
    let response: any;
    this.http
      .post(`${environment.baseUrl}/login/token.php`, form)
      .subscribe((res: any) => {
        if (res.hasOwnProperty('token')) {
          this.navBar.next(true);
          localStorage.setItem('token', JSON.stringify(res));
          this._site.fetchAllInfo(res.token);
          this.wrongCredential.next("");
          setTimeout(()=>{
            this.router.navigate(['dashboard']);
          },2000);
        }else{
          this.wrongCredential.next("wrong username or password");
        }
      });
  }
  Logout(): void {
    this.navBar.next(false);
    localStorage.clear();
  }
}
