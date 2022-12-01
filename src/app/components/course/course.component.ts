import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { QuizService } from 'src/app/services/quiz.service';
import { SiteService } from 'src/app/services/site.service';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss'],
})
export class CourseComponent implements OnInit {
  constructor(
    private acr: ActivatedRoute,
    private _site: SiteService,
    private _quiz: QuizService,
    private title: Title
  ) {}
  courseContent: any = {};
  courseName: string = '';
  quiz: any = {};
  courseId: string = '0';
  currentPage = 0;
  ngOnInit(): void {
    this.title.setTitle("course");
    this.courseId = this.acr.snapshot.params['id'];
    this.courseName = this.acr.snapshot.params['name'];
    console.log('course id is ', this.courseId);
    this._site.getCourseContent(this.courseId).subscribe((res) => {
      this.courseContent = res;
      console.log(this.courseContent);
    });
    let jsontoken = localStorage.getItem('token');
    let tokens: any = {};
    if (jsontoken !== null) {
      tokens = JSON.parse(jsontoken);
    }
    console.log(tokens.token, this.courseId);
    this._quiz.getQuiz(tokens.token, this.courseId).subscribe((res: any) => {
      this.quiz = res;
    });
  }
}
