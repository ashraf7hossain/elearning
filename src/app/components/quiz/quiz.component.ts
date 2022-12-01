
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizService } from 'src/app/services/quiz.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss'],
})
export class QuizComponent implements OnInit {
  constructor(
    private acr: ActivatedRoute,
    private _quiz: QuizService,
    private router: Router
  ) {}
  courseId: string = '';
  quizId: string = '';
  buttonText: string = "RE-ATTEMPT";
  attemptId: string = "";
  quizContent: any = {};
  quizSummary: any;
  attempts: any[] = [];
  token: string  = "";
  ngOnInit(): void {
    this.courseId = this.acr.snapshot.params['courseid'];
    this.quizId = this.acr.snapshot.params['quizid'];
    let jsontoken: any = localStorage.getItem('token');
    let token = JSON.parse(jsontoken).token;
    this.token = token;
    // this._quiz.getQuiz(token, this.courseId).subscribe((res: any) => {
    //   this.quizContent = res;
    //   this.quizId = res.quizzes[0].id;
    //   console.log(res);
    // });

    setTimeout(() => {
      this._quiz.getUserAttempts(token, this.quizId).subscribe((res: any) => {
        this.quizSummary = res;
        this.attempts = res.attempts;
        for(const attempt of this.attempts){
          if(attempt.state === "inprogress"){
            this.buttonText = "CONTINUE ATTEMPT";
            this.attemptId = attempt.id;
          }
        }
      });
    }, 1000);
  }

  goto(attempt: any) {
    if(attempt.state === "finished")this.router.navigate([`review/${attempt.id}`]);
    else{
      this.router.navigate([`question/${this.quizId}/${attempt.id}`]);
    }
  }

  attempt(){
    if(this.buttonText === "CONTINUE ATTEMPT"){
      this.router.navigate([`question/${this.quizId}/${this.attemptId}`]);
    }else{
      this._quiz.newAttempt(this.token,this.quizId).subscribe((res: any) =>{
        console.log(res);
        this.router.navigate([`question/${this.quizId}/${res.attempt.id}`]);
      });
    }
  }
}
