import { Component, OnInit, Input} from '@angular/core';
import {Chart} from 'chart.js';
import { UserService, AuthenticationService, AlertService } from '../_services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
//SliderModule
import { Options } from 'ng5-slider';
@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.less']
})
export class ChartsComponent implements OnInit {

  //slider stuff
  value: number = 100;
  options: Options = {
    floor: 0,
    ceil: 2000
  };
  //addition
  //this input will be the number of students
  @Input('inputter') userInput :string;
  //this boolean will prevent the graph from showing up until input is received

  chartsForm: FormGroup;
  title: 'Graph';
  chart = Chart;
  list_of_charts=[];
  constructor(private http: HttpClient,
    private authenticationService: AuthenticationService,
    private router: Router,
  ){}
  ngOnInit() {
    if (this.authenticationService.currentUserValue) {
        this.router.navigate(['/charts']);
    }else{
        this.router.navigate(['/']);
    }
  // if graph must show at the beginning of anything put code here
  this.userInput="0";
}// end of ngOnInit()

  //Demo graphs to see structure of a graph
    private getGraph(){
        this.http.get(`http://localhost:8000/markov/900/`).subscribe(data =>{console.log(data);});
        //.subscribe(data =>{console.log(data);})
        this.chart = new Chart ('canvas', {
          type:'line',
          data:{
            //labels are in one of the coordinatesEg: months (JAN,FEB,ETC.)
            labels:[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
            //datasets are the elements to be charted, the lines each {} is one line/function
            datasets:[{
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
        this.chart = new Chart ('canvas1', {
          type:'line',
          data:{
            //labels are in one of the coordinatesEg: months (JAN,FEB,ETC.)
            labels:[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
            //datasets are the elements to be charted, the lines each {} is one line/function
            datasets:[{
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

    private getGraphArr(userInput){

        //logs in the console what is being received
        this.http.get(`http://localhost:8000/markov/`+userInput+`/`).subscribe(data =>{console.log(data);

          for (i = 0; i <this.list_of_charts.length ; i++){
            this.list_of_charts[i].destroy();
          }
          this.list_of_charts=[];

          var x_axis=[];
          var dataset_list = [];
          //this for loop will get each of the graphs
          var charts,graphs,functions;
          var colors=['red','blue','purple','yellow','black','brown','Crimson','Cyan','DarkOrchid'];
          var canvases = ['canvas','canvas1','canvas2','canvas3','canvas4','canvas5'];
          var iterator =0;
          var graphs_container = "Figures";
          var description="default";
          var i =1;
              for (let graphs in data[graphs_container]){
                for (functions in data[graphs_container][graphs]){
                  if (functions == "x-axis"){
                    x_axis = data[graphs_container][graphs][functions];
                  }else if(functions=="description"){
                    description=functions;
                  }else{
                    console.log(data[graphs_container][graphs][functions]);
                    dataset_list.push( this.initializeDataset(functions, data[graphs_container][graphs][functions][0],
                    data[graphs_container][graphs][functions][1],data[graphs_container][graphs][functions][1])  );
                    iterator = iterator +1;
                  }
                }
                if (dataset_list.length>0){
                  this.initializeGraph("canvas"+i,dataset_list,x_axis);
                  var canvas = <HTMLCanvasElement>document.getElementById("canvas"+(i+1));
                  var context = canvas.getContext("2d");
                  context.font = "bold 16px Arial";
                  context.fillText(description, 100, 100);
                  dataset_list=[];
                  iterator=0;
                  i=i+1;
                }
              }
         }
        );
    }
    private initializeDataset (_label,_data, _backgroundColor, _borderColor){
      var ans ={"label": _label , "data":_data, "backgroundColor":_backgroundColor, "borderColor": _borderColor,"fill": false};
      //console.log(ans);
      return ans;
    }
    private initializeGraph (id,_datasets, _labels){
      this.chart = new Chart (id,{
        type:'line',
        data: {
          // labels: [0.0, 1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0, 11.0, 12.0, 13.0, 14.0, 15.0],
          labels: _labels,
          datasets:_datasets,
        }
      })
      this.list_of_charts.push(this.chart);
    }
    //this function works
    private getGraphTest(userInput){
        this.http.get(`http://localhost:8000/markov/`+userInput+`/`).subscribe(data =>{console.log(data);});
        //.subscribe(data =>{console.log(data);})
    }
    //Not used
    onUpdateServerName (event: any){
      this.userInput = (<HTMLInputElement>event.target).value;
    }
}
