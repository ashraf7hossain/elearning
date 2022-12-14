import { NgModule } from '@angular/core';
import { LoginComponent } from './components/login/login.component';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';

import { AuthGuard } from './guards/auth.guard';
import { CourseComponent } from './components/course/course.component';
import { QuizComponent } from './components/quiz/quiz.component';
import { ResourceComponent } from './components/resource/resource.component';
import { QuestionComponent } from './components/question/question.component';
import { ReviewComponent } from './components/review/review.component';
import { UserComponent } from './components/user/user.component';

const routes: Routes = [
  {path : '' , component: LoginComponent},
  {path : 'dashboard' , component: DashboardComponent , canActivate: [AuthGuard]},
  {path : 'course/:id/:name' , component: CourseComponent},
  {path : 'quiz/:courseid/:quizid' , component: QuizComponent},
  {path : 'resource/:id/:quizid' , component: ResourceComponent},
  {path : 'question/:quiz/:attempt' , component: QuestionComponent},
  {path : 'review/:id' , component: ReviewComponent},
  {path : 'user' , component: UserComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

export const routingComponents = [
  LoginComponent,
  DashboardComponent,
  CourseComponent,
  QuizComponent,
  ResourceComponent,
  QuestionComponent,
  ReviewComponent,
  UserComponent
]
