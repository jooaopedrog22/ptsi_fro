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
  DisabledVal = false;


  selectList = [];
  selectListDisable = [];
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
    console.log(this.SelectFormGroup);
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

  sortDim(ArraySkeleton){
    let ArrayValContador = 0;
    let newFilteredArray = [];
    let Cont = 0;
    for(let NoVariable of ArraySkeleton){
      newFilteredArray.push([]);
      for(let NoVariable2 of ArraySkeleton){
        newFilteredArray[Cont].push([]);
      }
      Cont += 1;
    }

    for(let ArrayVal of ArraySkeleton){
      if(ArrayVal.length !> 0){
        for(let obs in this.datasets){
          let parsedVal = obs.split(":");
          if(ArrayVal.some(Val => Val == parsedVal[ArrayValContador])){
            for(var w = 0; w < ArraySkeleton.length; w++){
              if(w != ArrayValContador && !(newFilteredArray[ArrayValContador][w].includes(parsedVal[w]))){
                  newFilteredArray[ArrayValContador][w].push(parsedVal[w]);
                  newFilteredArray[ArrayValContador][ArrayValContador] = ["Filter"];
              }
            }
          }
        }
      }

    ArrayValContador  += 1;
    }

    console.log(newFilteredArray);
    var FinalArray = [];
    for(var k = 0; k < newFilteredArray.length; k++){
      var PlaceHolderFilter = [];
      for(var j = 0; j < newFilteredArray.length; j++){
        //console.log("J : " + j + "    K: " + k);
        //console.log(newFilteredArray[j]);
        if(k != j){
          if(newFilteredArray[j][j].includes("Filter")){
            //console.log("Entrou com nunhum filter")
            if(PlaceHolderFilter.length == 0){
              PlaceHolderFilter = newFilteredArray[j][k];
            }else{
              PlaceHolderFilter = PlaceHolderFilter.filter(value => newFilteredArray[j][k].includes(value))
            }
          }
        }
      }
      FinalArray[k] = PlaceHolderFilter;
    }
    console.log(FinalArray);
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
    console.log(this.SelectFormGroup);
  }

  ngOnDestroy(){
    this.FilterSubscription.unsubscribe();
  }
}
