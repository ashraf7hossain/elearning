import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'
import { FormsModule } from '@angular/forms';


import { AppRoutingModule,routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';


import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CourseComponent } from './components/course/course.component';
import { QuizComponent } from './components/quiz/quiz.component';
import { ResourceComponent } from './components/resource/resource.component';
import { QuestionComponent } from './components/question/question.component';
import { ReviewComponent } from './components/review/review.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { UserComponent } from './components/user/user.component';
import { UserAchivementComponent } from './shared/components/user-achivement/user-achivement.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    routingComponents,
    DashboardComponent,
    CourseComponent,
    QuizComponent,
    ResourceComponent,
    QuestionComponent,
    ReviewComponent,
    NavbarComponent,
    UserComponent,
    UserAchivementComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
