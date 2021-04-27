import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-my-bar-chart',
  templateUrl: './my-bar-chart.component.html',
  styleUrls: ['./my-bar-chart.component.css']
})
export class MyBarChartComponent implements OnInit {

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
  


  constructor(private http:HttpClient) { }

  ngOnInit() {
    let resp = this.http.get("https://backend-ptsi.herokuapp.com/UNICEF/Df/CDCOV/CD2030");
    resp.subscribe((data) => {

      console.log(data);
    });    
  }
}
