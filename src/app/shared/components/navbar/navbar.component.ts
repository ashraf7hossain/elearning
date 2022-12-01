import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(private _auth: AuthService, private router: Router) { }
  visible: boolean = false;
  ngOnInit(): void {
    this._auth.currentNavBar.subscribe(res => {
      this.visible = res || localStorage.getItem("token") !== null;
    })
  }
  goto(route: string){
    console.log(route);
    
    this.router.navigate([route]);
  }
  logout() {
    this._auth.Logout();
    this.visible = false;
    this.router.navigate(['']);
  }

}
