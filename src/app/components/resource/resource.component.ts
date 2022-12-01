import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
import { DomElementSchemaRegistry } from '@angular/compiler';

@Component({
  selector: 'app-resource',
  templateUrl: './resource.component.html',
  styleUrls: ['./resource.component.scss'],
})
export class ResourceComponent implements OnInit {
  constructor(private acr: ActivatedRoute, private http: HttpClient, private domSanitize: DomSanitizer) {}

  courseId: string = '';
  resources: any = {};
  contents: any = {};

  ngOnInit(): void {
    this.courseId = this.acr.snapshot.params['id'];
    let form:FormData = new FormData();

    let jsontoken = localStorage.getItem('token');
    let token = "";

    if(jsontoken !== null){
      token = JSON.parse(jsontoken).token;
    }

    form.append('wsfunction','mod_resource_get_resources_by_courses');
    form.append('moodlewsrestformat','json');
    form.append('wstoken' , token);
    form.append('courseids[0]', this.courseId);

    this.http.post(`${environment.baseUrl}/webservice/rest/server.php`, form).subscribe((res : any) => {
      console.log( res );
      console.log(res.resources);
      
      this.resources = res.resources;
;
      
      let ret = res.resources[0].contentfiles[0].fileurl.replace('/webservice','');

      console.log(ret);
      

      this.contents = this.domSanitize.bypassSecurityTrustResourceUrl(ret);
      
    })
  }
}
