import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FilteredDataService {

  public FilteredDataUrl;

  private messageSource = new Subject<object>();
  messageChanges$ = this.messageSource.asObservable();

  constructor() { }

  changeMessage(message: object){
    this.messageSource.next(message);
  }

  setDataUrl(Url){
    this.FilteredDataUrl = Url;
  }
}
