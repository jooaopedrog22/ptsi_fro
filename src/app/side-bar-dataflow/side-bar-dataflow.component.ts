import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FilterService } from '../filter.service';
import {FilteredDataService} from '../filtered-data.service';
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
  DisabledVal = false;


  selectList = [];
  selectListDisable = [];
  SelectFormGroup = new FormGroup({})

  StringFilter:string = "";
  StringFilterURL:string ="";


  constructor(private _filter:FilterService, private http:HttpClient, private _filtered_data:FilteredDataService) { 
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
        let dimensionsListValPlaceHolder = [];  //Substitute with the actual one
        for(let i = 0; i < this.dimensions.length; i++){ dimensionsListValPlaceHolder.push(this.dimensions[i].values) }
        this.selectList = dimensionsListValPlaceHolder;
        this.FormInit(this.dimensionsKeyName);
      })
    } 
  }

  FormInit(DimArray){
    this.SelectFormGroup = new FormGroup({})
    for(var i = 0; i < DimArray.length; i++){
      this.SelectFormGroup.addControl(`DimArray_${i}`, new FormControl([]));
    }
    for(var i = 0; i < this.selectList.length; i++){
      this.selectListDisable[i] = [];
      for(var k = 0; k < this.selectList[i].length; k++){
        this.selectListDisable[i][k] = {
          "id" : this.selectList[i][k].id,
          "DisabledVal": false
        }
      }
    }
  }

  updateSelect(event: any){
    this.filterMet();
  }

  filterMet(){
    var ArraySkeleton = [];
    for(let i = 0; i < this.dimensions.length; i++){
      let newArray = [];
      var PlaceholderSelect_Dim = this.SelectFormGroup.value[`DimArray_${i}`];
      if(PlaceholderSelect_Dim.length > 0){
        PlaceholderSelect_Dim.forEach(element => {
          this.dimensions[i].values.forEach(val => {
            if(element == val.id){
              newArray.push(this.dimensions[i].values.indexOf(val));
            }
          });
        });
      }
      ArraySkeleton.push(newArray); //Id of selected values
    }
    this.sortDim(ArraySkeleton);
  }

  async sortDim(ArraySkeleton){
    let FinalArray
    FinalArray = await this.FilterIntersection(ArraySkeleton)
    //console.log("Awaited Array:")
    //console.log(FinalArray)

    //Disable
    for(let i = 0; i < FinalArray.length; i++){
      if(FinalArray[i].length == 0){
        for(let j = 0; j < this.selectListDisable[i].length;j++){
          this.selectListDisable[i][j].DisabledVal = false;
        }
      }
      if(FinalArray[i].length > 0){
        for(let k = 0; k < this.selectListDisable[i].length; k++){
          if(FinalArray[i].some(elem => elem == k)){
            this.selectListDisable[i][k].DisabledVal = false;
          }else{
            if(this.SelectFormGroup.controls[`DimArray_${i}`].value.some(elem => elem == this.selectListDisable[i][k].id)){
              let NewFormVal = this.SelectFormGroup.controls[`DimArray_${i}`].value.filter(val => val !== this.selectListDisable[i][k].id)
              this.SelectFormGroup.controls[`DimArray_${i}`].setValue(NewFormVal,{emitViewToModelChange: false, emitModelToViewChange: true});
            }
            this.selectListDisable[i][k].DisabledVal = true;
            
          }
        }
      }
    }
    this.BuildFilterString();
  }


  BuildFilterString(){
    var MainArray = [];
    for(let dim in this.SelectFormGroup.controls){
      let newString:string = this.SelectFormGroup.controls[dim].value.join("+");
      MainArray.push(newString);
    }
    this.StringFilter  =  MainArray.join(".");
    console.log(this.StringFilter);
    this.StringFilterURL = `/UNICEF/v2/Dataflow/${this.Datastructure.datastructure_id}/${this.Datastructure.datastructure_agency}/filtercsv/${this.StringFilter}`
    console.log(this.StringFilterURL);
    this.Data_to_Service(this.StringFilterURL);
  }

  Data_to_Service(UrlString){
    this._filtered_data.changeMessage(UrlString);
    this._filtered_data.setDataUrl(UrlString);
  }

  ngOnDestroy(){
    this.FilterSubscription.unsubscribe();
  }

  FilterIntersection(selectedIds_Array){
    return new Promise(resolve=>{
      

      var FinalArray = [];
      for(let x = 0; x < selectedIds_Array.length; x++){
        FinalArray[x] = [];
      }

      for(let obs in this.datasets){
        let name_split = obs.split(":");
        for(let i = 0; i < name_split.length; i++){
          var DimsValidated = true;
          for(let k = 0; k < name_split.length; k++){
            if( i !== k && selectedIds_Array[k].length>0){
              if(!(selectedIds_Array[k].some(elem => elem == name_split[k]))){
                DimsValidated = false;
              }
            }
          }
          if(DimsValidated && !(FinalArray[i].some(val => val == name_split[i]))){
            FinalArray[i].push(name_split[i]);
          }
        }
      }

      resolve(FinalArray); //Output da promise
    })
  }
}
