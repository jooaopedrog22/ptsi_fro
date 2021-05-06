import { Component, OnInit } from '@angular/core';
import { GraphDataService } from '../graph-data.service';


@Component({
  selector: 'app-my-bar-chart',
  templateUrl: './my-bar-chart.component.html',
  styleUrls: ['./my-bar-chart.component.css']
})
export class MyBarChartComponent implements OnInit {

  //(Input) Dataflow that is holding all data
  public Dataflow;

  //Chart variables
  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };

  public barChartLabels = [];
  public barChartType = 'bar';
  public barChartLegend = true;

  public barChartData = [
    {data: [], label: "Dimension A"}
  ];  

  constructor(private _graph_data:GraphDataService) {
    this._graph_data.messageChanges$.subscribe((msg: object)=>{
      this.Dataflow = msg;
      this.InitDataflow()
    })
  }

  InitDataflow(){
    if(this.Dataflow !== undefined){
      console.log("Down is the dataflow in bar-chart");
      console.log(this.Dataflow);
    }else{
      console.log("Dataflow in bar-chart is undefined")
    }
  }


  ngOnInit() {
  }
}
