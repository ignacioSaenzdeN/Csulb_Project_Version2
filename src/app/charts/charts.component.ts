import { Component, OnInit } from '@angular/core';
import {Chart} from 'chart.js';
import { UserService, AuthenticationService, AlertService } from '../_services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.less']
})
export class ChartsComponent implements OnInit {
  //addition
  chartsForm: FormGroup;
  title: 'Graph';
  chart = [];
  constructor(private http: HttpClient  ){}
  ngOnInit() {
  this.getGraph();
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
          backgroundColor: 'red',
          borderColor: 'red',
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
    private getGraph(){
        this.http.get(`http://localhost:8000/markov/900/`).subscribe(data =>{console.log(data);});
        //.subscribe(data =>{console.log(data);})
    }
}
