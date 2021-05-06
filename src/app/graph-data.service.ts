import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class GraphDataService {


  public Dataflow;

  private messageSource = new Subject<object>();
  messageChanges$ = this.messageSource.asObservable();


  constructor() { }


  changeMessage(message: object){
    this.messageSource.next(message);
  }

  setSharedDataflow(Filtered_Dataflow){
    this.Dataflow = Filtered_Dataflow;
  }
}
