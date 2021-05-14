import { Component, OnInit } from '@angular/core';
import { FilteredDataService } from '../filtered-data.service';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { GraphDataService } from './../graph-data.service';

@Component({
  selector: 'app-side-button-filter',
  templateUrl: './side-button-filter.component.html',
  styleUrls: ['./side-button-filter.component.css']
})
export class SideButtonFilterComponent implements OnInit {

  public Filter_Message;
  public Dimensions;

  constructor(private http:HttpClient, private _filtered_data:FilteredDataService, private _graph_data:GraphDataService) {
    this._filtered_data.messageChanges$.subscribe((msg: object)=>{
      this.Filter_Message = msg;
    })
   }

  ClickButton(){
    if(this.Filter_Message == undefined){
      console.log("Ainda nao esta definido o filtro");
    }else{
      this.Dimensions = this._filtered_data.Dimensions;
      this.getFilteredDataflow(this.Filter_Message)
    }
    
  }

  getFilteredDataflow(FilterURL){
    let resp = this.http.get(`${environment.HostDomain}${FilterURL}`);
    resp.subscribe((data)=>{
      this._graph_data.setSharedDimensions(this.Dimensions);
      this._graph_data.changeMessage(data);
      this._graph_data.setSharedDataflow(data);      
    })
  }

  ngOnInit() {
  }

}
