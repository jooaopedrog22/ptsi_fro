import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FilteredDataService {

  public FilteredDataUrl;
  public Dimensions;

  private messageSource = new Subject<object>();
  messageChanges$ = this.messageSource.asObservable();

  constructor() { }

  changeMessage(message: object){
    this.messageSource.next(message);
  }

  setDataUrl(Url){
    this.FilteredDataUrl = Url;
  }

  setDimensions(Dimensions_Data){
    this.Dimensions = Dimensions_Data;
  }

  getDimensions(){
    return this.Dimensions;
  }
}
