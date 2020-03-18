import { Component, OnInit } from '@angular/core';
import {Chart} from 'chart.js';
@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.less']
})
export class LineChartComponent implements OnInit {

  //addition
  title: 'Graph';
  chart = [];

  constructor() { }

  ngOnInit() {

    this.chart = new Chart ('canvas', {
      type:'line',
      data:{
        //labels are in one of the coordinates
        //Eg: months (JAN,FEB,ETC.)
        labels:[2,4,6,8,10,12],
        //datasets are the elements to be charted, the lines
        // each {} is one line/function
        datasets:[
          {
          label: 'First dataset',
          data: [100,200,300,200,400,250,600],
          backgroundColor: 'blue',
          borderColor: 'blue',
          fill: false,
        },
        {
          label: 'Second dataset',
          data: [200,400,600,400,800,500,1200],
          backgroundColor: 'blue',
          borderColor: 'blue',
          fill: false,
        }//end of second dataset
      ]//end of dataset
      }//end of data
    })// enf of this.chart
  }// en of ngOnInit()

}
