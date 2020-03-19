import { Component, OnInit, Input} from '@angular/core';
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
  //this input will be the number of students
  @Input('inputter') userInput :string;
  //this boolean will prevent the graph from showing up until input is received
  showGraph:boolean;

  chartsForm: FormGroup;
  title: 'Graph';
  chart = [];
  constructor(private http: HttpClient  ){}
  ngOnInit() {
//  this.getGraph();
  // let list= this.getGraphArr();
  // console.log(list[0]);
  // console.log(list[1]);

  }// en of ngOnInit()
    private getGraph(){
        this.http.get(`http://localhost:8000/markov/900/`).subscribe(data =>{console.log(data);});
        //.subscribe(data =>{console.log(data);})
        this.chart = new Chart ('canvas', {
          type:'line',
          data:{
            //labels are in one of the coordinates
            //Eg: months (JAN,FEB,ETC.)
            labels:[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
            //datasets are the elements to be charted, the lines
            // each {} is one line/function
            datasets:[
              {
              label: 'COE Enrolled',
              data: [0, 900, 834, 807, 785, 764, 743, 720, 698, 548, 337, 168, 67, 19, 2, 0],
              backgroundColor: 'red',
              borderColor: 'red',
              fill: false,
            },
            {
              label: 'COE graduating',
              data: [0, 0, 0, 0, 0, 0, 0, 164, 212, 155, 83, 34, 9, 0, 0, 0],
              backgroundColor: 'blue',
              borderColor: 'blue',
              fill: false,
            }//end of second dataset
          ]//end of dataset
          }//end of data
        })// enf of this.chart
    }
    private getGraphArr(input){
        return this.http.get(`http://localhost:8000/markov/`+input+`/`);
        //.subscribe(data =>{console.log(data);})
    }
    private getGraphTest(userInput){
        this.http.get(`http://localhost:8000/markov/`+userInput+`/`).subscribe(data =>{console.log(data);});
        //.subscribe(data =>{console.log(data);})
    }
    onUpdateServerName (event: any){
      this.userInput = (<HTMLInputElement>event.target).value;

    }
}
