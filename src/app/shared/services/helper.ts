import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root',
  })

export class HelperService {


  constructor() {}

  formMaker(data: any): any {
    let form = new FormData();
    let tkn = localStorage.getItem('token');
    let token = '';
    if (tkn !== null) {
      token = JSON.parse(tkn).token;
    }
    form.append('wstoken', token);
    form.append('moodlewsrestformat', 'json');
    for (const [key, value] of Object.entries(data)) {
      form.append(key, value as string);
    }
    console.log({form});
    return form;
  }
}
