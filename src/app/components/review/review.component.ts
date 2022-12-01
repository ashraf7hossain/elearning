import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { QuizService } from 'src/app/services/quiz.service';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ReviewComponent implements OnInit {

  constructor(private acr: ActivatedRoute, private _quiz: QuizService, private sanitize: DomSanitizer) { }

  attemptId: string = "";
  questionsHtml: any[] = [];

  ngOnInit(): void {
    this.attemptId = this.acr.snapshot.params['id'];
    let jsontoken = localStorage.getItem('token');
    let token =  "";
    if(jsontoken !== null){
      token = JSON.parse(jsontoken).token;
      console.log(token);
      
    }
    this._quiz.getAttemptReview(token , this.attemptId).subscribe((res: any)=>{
      let temp = res.questions;
      console.log(res);
      for(let ques of temp){
        this.questionsHtml.push(this.sanitize.bypassSecurityTrustHtml(ques.html));
      }
    })
  }

  goBack(){
    
  }

}
