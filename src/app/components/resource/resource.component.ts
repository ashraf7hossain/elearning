import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
import { DomElementSchemaRegistry } from '@angular/compiler';
import { SiteService } from 'src/app/services/site.service';

import { HelperService } from 'src/app/shared/services/helper';

@Component({
  selector: 'app-resource',
  templateUrl: './resource.component.html',
  styleUrls: ['./resource.component.scss'],
})
export class ResourceComponent implements OnInit, OnDestroy, AfterViewInit {
  constructor(
    private acr: ActivatedRoute,
    private http: HttpClient,
    private domSanitize: DomSanitizer,
    private _site: SiteService,
    private router: Router,
    private helper: HelperService
  ) {}

  courseId: string = '';
  courseModuleId: string = '';
  resourceId: string = '';
  quizId: string = '';

  resources: any = {};
  contents: any = {};

  currentTime: number = 5 * 60 + 40;

  timeInterval: any;

  showBtn: boolean = false;

  ngOnInit(): void {
    this.courseId = this.acr.snapshot.params['id'];
    this.quizId = this.acr.snapshot.params['quizid'];
    let form: FormData = new FormData();

    let jsontoken = localStorage.getItem('token');
    let token = '';

    if (jsontoken !== null) {
      token = JSON.parse(jsontoken).token;
    }

  
    form.append('wsfunction', 'mod_resource_get_resources_by_courses');
    form.append('moodlewsrestformat', 'json');
    form.append('wstoken', token);
    form.append('courseids[0]', this.courseId);

    this.http
      .post(`${environment.baseUrl}/webservice/rest/server.php`, form)
      .subscribe((res: any) => {
        console.log('resource', res);
        console.log(res.resources);

        this.resources = res.resources;
        this.courseModuleId = this.resources[0].coursemodule;
        this.resourceId = this.resources[0].id;

        this.videoHandler();

        console.log('coursemodule ', this.courseModuleId);

        this._site.activityStatus(this.courseId, token).subscribe(res => {
          for(let status of res.statuses){
            if(status.modname === 'resource'){
              this.showBtn = status.state > 0;
            }
          }
        })

        let ret = res.resources[0].contentfiles[0].fileurl + `?token=${token}`;

        console.log(ret);
        this.contents = this.domSanitize.bypassSecurityTrustResourceUrl(ret);
      });

  }

  ngOnDestroy(): void {
    clearInterval(this.timeInterval);
  }

  ngAfterViewInit(): void {
    
  }

  goto(): void {
    // console.log("course id and quiz id", this.courseId, this.quizId);
    let url  = `/quiz/${this.courseId}/${this.quizId}`;
    console.log(url);
    this.router.navigate([url]);
  }

  doit(){
    
  }

  videoHandler(): void {
    let cmid = this.resourceId.toString();
    let tempTime = localStorage.getItem(cmid);
    if (tempTime !== null) {
      this.currentTime = JSON.parse(tempTime) as number;
    }
    let video: HTMLVideoElement = document.getElementById(
      'video'
    ) as HTMLVideoElement;
    // console.log("cmid ", cmid);
    video.currentTime = this.currentTime;
    video.addEventListener('play', () => {
      this.timeInterval = setInterval(() => {
        this.currentTime = video.currentTime;
        console.log('current time is ', this.currentTime);
        localStorage.setItem(
          JSON.stringify(this.resourceId),
          JSON.stringify(this.currentTime)
        );
      }, 100);
    });

    video.addEventListener('pause', () => {
      console.log('video is paused');
      clearInterval(this.timeInterval);
    });

    video.addEventListener('ended', () => {
      console.log('video ended : ');

      let form = new FormData();
      let temptoken = localStorage.getItem('token');
      let token = '';
      if (temptoken !== null) {
        token = JSON.parse(temptoken).token;
      }
      form.append('wstoken', token);
      form.append(
        'wsfunction',
        'core_completion_update_activity_completion_status_manually'
      );
      form.append('moodlewsrestformat', 'json');
      form.append('cmid', this.courseModuleId);
      form.append('completed', '1');

      this.http
        .post(`${environment.baseUrl}/webservice/rest/server.php`, form)
        .subscribe((res: any) => {
          console.log(res);
          this.showBtn = true;
        });
    });
  }
}
