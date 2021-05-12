import { Component, OnInit } from '@angular/core';
import { GraphDataService } from '../graph-data.service';
import { Chart } from 'chart.js';


@Component({
  selector: 'app-my-bar-chart',
  templateUrl: './my-bar-chart.component.html',
  styleUrls: ['./my-bar-chart.component.css']
})
export class MyBarChartComponent implements OnInit {

  //(Input) Dataflow that is holding all data
  public Dataflow;

  //Chart variables
  chart;

  constructor(private _graph_data:GraphDataService) {
    this._graph_data.messageChanges$.subscribe((msg: object)=>{
      this.Dataflow = msg['data'];
      console.log(this.Dataflow)
      if(this.chart !== undefined){
        this.chart.destroy()
      }
      this.InitDataflow()
    })
  }

  InitDataflow(){
    if(this.Dataflow !== undefined){
      let TIME_PERIOD = this.Dataflow.map(dataset=>dataset.TIME_PERIOD);
      let OBS_VALUE = this.Dataflow.map(dataset=> [dataset.TIME_PERIOD,dataset.CDCOVERAGEINDICATORS, dataset.OBS_VALUE, dataset.CDAREAS]);
      let uniqueTIME_PERIOD = TIME_PERIOD.filter((c, index) => {
        return TIME_PERIOD.indexOf(c) === index;
      });
      console.log(uniqueTIME_PERIOD)
      uniqueTIME_PERIOD.sort()
      console.log(uniqueTIME_PERIOD)
      let datasetsFinal = {};
      OBS_VALUE.filter((data)=>{
        if(datasetsFinal[`${data[3]}`] == undefined){
          datasetsFinal[`${data[3]}`] = [ [data[0], data[2]] ];
        }else{
          datasetsFinal[`${data[3]}`].push([data[0], data[2]])
        }
      })

      let FinalArray = [];
      for(var i = 0; i < Object.keys(datasetsFinal).length; i++){
        let templateDataset = {};
        for(let TimePeriod in uniqueTIME_PERIOD){
          if(templateDataset['label'] == undefined){templateDataset['label'] = Object.keys(datasetsFinal)[i]}
          if(templateDataset['data'] == undefined){templateDataset['data'] = []}
          if(datasetsFinal[Object.keys(datasetsFinal)[i]][0][0] == uniqueTIME_PERIOD[TimePeriod]){
            templateDataset['data'].push(datasetsFinal[Object.keys(datasetsFinal)[i]][0][1])
          }else{
            templateDataset['data'].push([]);
          }
        }
        FinalArray.push(templateDataset);
      }
      console.log(FinalArray);

      this.chart = new Chart('canvas', {
        type: 'bar',
        data: {
          labels: uniqueTIME_PERIOD,
          datasets: FinalArray
        },
        options: {
          legend: {
            display: true
          },
          scales: {
            xAxes: [{
              display: true
            }],
            yAxes: [{
              display: true
            }]
          }
        }
      })
      
    }else{
      console.log("Chart is still undefined")
    }
  }


  ngOnInit() {

  }
}
