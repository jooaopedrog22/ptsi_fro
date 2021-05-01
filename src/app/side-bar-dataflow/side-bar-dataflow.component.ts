import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FilterService } from '../filter.service';
import {environment} from './../../environments/environment';
import {FormControl, FormGroup} from '@angular/forms';


@Component({
  selector: 'app-side-bar-dataflow',
  templateUrl: './side-bar-dataflow.component.html',
  styleUrls: ['./side-bar-dataflow.component.css']
})
export class SideBarDataflowComponent implements OnInit, OnDestroy {

  Datastructure; 
  FilterSubscription: Subscription;
  Dataflow: Object;
  dimensions;
  dimensionsKeyName = [];
  datasets;


  selectList = [];
  SelectFormGroup = new FormGroup({})


  constructor(private _filter:FilterService, private http:HttpClient) { 
    this.FilterSubscription = this._filter.messageChanges$.subscribe((msg: object)=>{
      this.Datastructure = msg;
      this.getDataflow();
    })    
  }

  ngOnInit() {
    this.Datastructure = this._filter.Datastructure;
    this.getDataflow();
  }
  
  getDataflow(){
    if(this.Datastructure.datastructure_id !== "null"){
      let resp = this.http.get(`${environment.HostDomain}/UNICEF/Df/${this.Datastructure.datastructure_id}/${this.Datastructure.datastructure_agency}`);
      resp.subscribe((data) => {
        this.Dataflow = data;
        this.dimensions = this.Dataflow["Dimensions"];
        this.datasets = this.Dataflow["Datasets"];
        let dimensionsKeyNamePlaceHolder = [];  //Substitute with the actual one
        for(let i = 0; i < this.dimensions.length; i++){ dimensionsKeyNamePlaceHolder.push(this.dimensions[i].name) }
        this.dimensionsKeyName = dimensionsKeyNamePlaceHolder;
        console.log(this.Dataflow);
        console.log(this.dimensions);
        let dimensionsListValPlaceHolder = [];  //Substitute with the actual one
        for(let i = 0; i < this.dimensions.length; i++){ dimensionsListValPlaceHolder.push(this.dimensions[i].values) }
        this.selectList = dimensionsListValPlaceHolder;
        console.log(this.selectList);
        this.FormInit(this.dimensionsKeyName);
      })
    } 
  }

  FormInit(DimArray){
    this.SelectFormGroup = new FormGroup({})
    for(var i = 0; i < DimArray.length; i++){
      this.SelectFormGroup.addControl(`DimArray_${i}`, new FormControl(''));
    }
    console.log(this.SelectFormGroup);
  }

  updateSelect(event: any){
    console.log("Deu");
    console.log(event);
    console.log(this.SelectFormGroup);
  }

  ngOnDestroy(){
    this.FilterSubscription.unsubscribe();
  }
}
