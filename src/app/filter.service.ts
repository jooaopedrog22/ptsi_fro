import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  public Datastructure;

  constructor() { }

  private messageSource = new Subject<object>();
  messageChanges$ = this.messageSource.asObservable();

  changeMessage(message: object){
    this.messageSource.next(message);
  }

  setDatastructure(Datastructure){
    this.Datastructure = Datastructure;
  }

}
