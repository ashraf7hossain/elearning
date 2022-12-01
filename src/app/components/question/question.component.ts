import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizService } from 'src/app/services/quiz.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class QuestionComponent implements OnInit {
  constructor(
    private acr: ActivatedRoute,
    private _quiz: QuizService,
    private sanitize: DomSanitizer,
    private http: HttpClient,
    private router: Router
  ) {}

  quizId: string = '';
  attemptId: string = '';
  token: string = '';
  questionContent: any = {};
  questionCard: any = {};
  questionCards: any[] = [];
  nextPage = 0;
  cleanHtml = '';
  quid: string = ''; // question id
  qsid: string = ''; // question sequence id
  cqs: number = 1; // current question number default is 1
  ngOnInit(): void {
    this.quizId = this.acr.snapshot.params['quiz'];
    this.attemptId = this.acr.snapshot.params['attempt'];
    this.quid = `q${this.attemptId}:${this.cqs}_answer`;
    this.qsid = `q${this.attemptId}:${this.cqs}_:sequencecheck`;
    let jsontoken: any = localStorage.getItem('token');
    this.token = JSON.parse(jsontoken).token;
    this._quiz
      .getAttemptData(this.token, this.attemptId)
      .subscribe((res: any) => {
        this.questionContent = res;
        this.nextPage = res.nextpage;
        this.questionCard = this.sanitize.bypassSecurityTrustHtml(
          res.questions[0].html
        );
        this.questionCards = res.questions.map((quest: any) =>
          this.sanitize.bypassSecurityTrustHtml(quest.html)
        );
        console.log(this.questionCards);
      });
  }

  nextQuestion() {
    let data: any[] = this.prepareSubmission();
    let finishAttempt = '0';
    let timeup = '0';
    if (this.nextPage === -1) {
      finishAttempt = '1';
      timeup = '1';
    }
    this._quiz
      .processAttempt(this.token, this.attemptId, data, finishAttempt, timeup)
      .subscribe((res: any) => {
        console.log(res);
      });
    this._quiz
      .getAttemptData(this.token, this.attemptId, '1')
      .subscribe((res: any) => {
        this.nextPage = res.nextpage;
        console.log(res);
        this.questionCards = res.questions.map((quest: any) =>
          this.sanitize.bypassSecurityTrustHtml(quest.html)
        );
        console.log(this.questionCards);
      });
  }

  prepareSubmission(): any[] {
    let allRadioInputs: any[] = [];
    let quids = [];
    let data: any = [];
    let nodeList:any[] = Array.from(
      document.querySelectorAll('input[name*=sequencecheck]')
    );
    nodeList = nodeList.map((node: any) => ({name : node.name, value: node.value}));
    let answerList: any[] = Array.from(
      document.querySelectorAll('input[name*=answer')
    );

    answerList = answerList
      .filter((answer: any) => answer.checked === true)
      .map((node: any) => ({ name: node.name, value: node.value }));

    for(let i = 0 ; i < answerList.length; ++i){
      data.push(answerList[i]);
      data.push(nodeList[i]);
      // data.push({name: node.name , value: node.value});
    }

    // console.log(data);

    return data;
  }

  submitAttempt() {
    let data: any[] = this.prepareSubmission();
    let finishAttempt = '0';
    let timeup = '0';
    if (this.nextPage === -1) {
      finishAttempt = '1';
      timeup = '1';
    }
    this._quiz
      .processAttempt(this.token, this.attemptId, data, finishAttempt, timeup)
      .subscribe((res: any) => {
        if (res.state === 'finished') {
          this.router.navigate([`review/${this.attemptId}`]);
        }
      });
  }
}
