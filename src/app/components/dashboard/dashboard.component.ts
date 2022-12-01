import { Component, OnInit } from '@angular/core';
import { DomSanitizer, Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { SiteService } from 'src/app/services/site.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  constructor(
    private _site: SiteService,
    private _auth: AuthService,
    private router: Router,
    private sanitize: DomSanitizer,
    private meta: Meta,
    private title: Title
  ) {
    this.title.setTitle("dashboard");
  }

  courses: any[] = [];
  recentCourses: any[] = [];
  imgUrls: string[] = [];

  behaveCourses = new BehaviorSubject<any[]>([]);
  
  currentCourses = this.behaveCourses.asObservable();

  courseOpen: boolean = false;
  ngOnInit(): void {
    this._site.currentUserSiteInfo.subscribe((res) => {
      console.log(' user id ', res.userid);
    });

    this._site.getEnrollCourses().subscribe((res: any) => {
      this.behaveCourses.next(res);
      console.log(res);
      this.courses = this.courses.map((course: any) => {
        return { ...course, css: this.getCss(course.progress) };
      });
    });

    this.currentCourses.subscribe((res) => {
      this.courses = res;
    })

    this._site.getRecentCourses().subscribe((res) => {
      this.recentCourses = res;
      console.log("recentCourse ",res);
      
      for (let course of this.recentCourses) {
        this.imgUrls.push(course.viewurl);
      }
    });
    // this._site.getCourseContent('131').subscribe(res => {
    //   console.log(" logging course contents ",res);
    // })
  }
  goToCourse() {}
  getCss(width: number) {
    return {
      'width': `${width * 2}px`,
      'height': '15px',
      'background-color': '#243982',
      'border-radius': '5px',
    };
  }
  toggleCourse() {
    this.courseOpen = !this.courseOpen;
  }
  
}
