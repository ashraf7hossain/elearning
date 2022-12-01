import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SiteService {
  private token: string = '';
  private userInfo: any = {};

  constructor(private http: HttpClient) {
    let jsontoken = localStorage.getItem('token');
    let tokens: any = {};
    if (jsontoken !== null) {
      tokens = JSON.parse(jsontoken);
    }
    this.token = tokens.token;
    this.fetchAllInfo(this.token);
  }

  private userSiteInfo = new BehaviorSubject<any>({});

  currentUserSiteInfo = this.userSiteInfo.asObservable();

  fetchAllInfo(tkn: string): void {
    let form = new FormData();

    form.append('wstoken', tkn);
    form.append('wsfunction', 'core_webservice_get_site_info');
    form.append('moodlewsrestformat', 'json');
    form.append('serviceshortnames[0]', 'core_webservice_get_site_info');
    this.http
      .post(`${environment.baseUrl}/webservice/rest/server.php`, form, {})
      .subscribe((res: any) => {
        localStorage.removeItem('userid');
        localStorage.setItem('userid', res.userid);
        this.userSiteInfo.next(res);
      });
  }

  getUserId() {
    let ret = '-1';
    this.currentUserSiteInfo.subscribe((res) => {
      ret = res.userid;
      console.log(res.userid);
    });
    return ret;
  }

  getEnrollCourses(): Observable<any> {
    let form = new FormData();
    let userid = localStorage.getItem('userid');

    if (userid !== null) {
      form.append('wstoken', this.token);
      form.append('moodlewsrestformat', 'json');
      form.append('wsfunction', 'core_enrol_get_users_courses');
      form.append('userid', userid);
    }

    return this.http.post(
      `${environment.baseUrl}/webservice/rest/server.php`,
      form
    );
  }
  getRecentCourses(): Observable<any> {
    let form = new FormData();
    let userid = localStorage.getItem('userid');

    if (userid !== null) {
      form.append('wstoken', this.token);
      form.append('moodlewsrestformat', 'json');
      form.append('wsfunction', 'core_course_get_recent_courses');
      form.append('userid', userid);
    }
    return this.http.post(
      `${environment.baseUrl}/webservice/rest/server.php`,
      form
    );
  }

  getCourseContent(courseid: string): Observable<any> {
    let form = new FormData();
    form.append('wstoken', this.token);
    form.append('wsfunction', 'core_course_get_contents');
    form.append('moodlewsrestformat', 'json');
    form.append('courseid', courseid);
    return this.http.post(
      `${environment.baseUrl}/webservice/rest/server.php`,
      form,
      {
        responseType: 'json',
      }
    );
  }
}
