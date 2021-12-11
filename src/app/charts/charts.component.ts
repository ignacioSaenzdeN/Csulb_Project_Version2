import { Component, OnInit, Input } from '@angular/core';
import { Chart } from 'chart.js';
import { UserService, AuthenticationService, AlertService, } from '../_services';
import { GraphService } from "../_services/graph.service";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { CohortService } from '../_services/cohort.service';
//SliderModule
import { Options } from 'ng5-slider';
import { ViewportScroller } from '@angular/common';

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

  //this will contain queried data for the drop down menu
  showChartOptionalInputs: boolean = false;
  numberOfStudents: string = "0";
  //This flag hides the cohort selection for charts
  hideSelectCohort: boolean = true;
  hideNewCohortButton: boolean = false;
  // Temp variables for filing up greek letter fields
  sigma: string = "";
  alpha: string = "";
  beta: string = "";
  hideOptionalComponentsAndCharts: boolean = false;
  steadyState: string = "False";
  //addition
  //this input will be the number of students
  @Input('inputter') userInput: string;

  // title: 'Graph';
  //chart = Chart;
  //this variable will include all the raw data from each set of graphs
  //list_of_charts = [];
  // this variable will include the description of each of the graphs
  description_temp = "";

  // this id is used for querying the highereddatabase when we edit the cohor
  higherEdId = "";

  constructor(private http: HttpClient,
    private authenticationService: AuthenticationService,
    private cohortService: CohortService,
    private graphService: GraphService,
    private router: Router,
    private vps: ViewportScroller,

  ) { }
  //if the user is logged in, the user will remain in ChartsComponent, the user
  // will be redirected to the login otherwise
  ngOnInit() {
    if (this.authenticationService.currentUserValue && this.authenticationService.isTokenValid()) {
      this.router.navigate(['/charts']);
    } else {
      this.authenticationService.logout();
      this.router.navigate(['/']);
    }
    // if graph must show at the beginning of anything put code here
    this.userInput = "0";
    //initializes the form
    this.cohortService.clearDropDown();
    this.cohortService.createForm();
  }// end of ngOnInit()

  // f() is just a shortcut to access the controls
  get f() { return this.cohortService.queryGraphs.controls; }
  

  // private displayGraph(data) {
  //   console.log("im here?")
  //   // this.description_temp = [];
  //   for (i = 0; i < this.list_of_charts.length; i++) {
  //     this.list_of_charts[i].destroy();
  //   }
  //   var yLabel = "";
  //   this.list_of_charts = [];

  //   var x_axis = [];
  //   var dataset_list = [];
  //   //this for loop will get each of the graphs
  //   var charts, graphs, functions;
  //   //var colors=['red','blue','purple','yellow','black','brown','Crimson','Cyan','DarkOrchid'];
  //   var canvases = ['canvas', 'canvas1', 'canvas2', 'canvas3', 'canvas4', 'canvas5'];
  //   var iterator = 0;
  //   // the following strings need to match the values they have in the backend
  //   // to properly access the data.
  //   // the code below, starts decapsuling the data received from the backend
  //   // and stores the data from each layer in its corresponding variable.
  //   // The concept of the code below is similar to the russian dolls.
  //   // To better understand the structure of the data received, check \
  //   // the backend code
  //   var graphs_container = "Figures";
  //   var description = "default";
  //   var i = 1;
  //   for (let graphs in data[graphs_container]) {
  //     for (functions in data[graphs_container][graphs]) {
  //       if (functions == "x-axis") {
  //         x_axis = data[graphs_container][graphs][functions];
  //       } else if (functions == "description") {
  //         this.description_temp = (data[graphs_container][graphs][functions]);
  //         // +"\n"
  //       } else if (functions == 'yLabel') {
  //         yLabel = data[graphs_container][graphs][functions];
  //       }
  //       else {
  //         // console.log(data[graphs_container][graphs][functions]);
  //         if ((graphs == "figure4") && (data[graphs_container][graphs][functions].length > 2)) {
  //           let checkBool = (data[graphs_container][graphs][functions][2] === 'true')
  //           dataset_list.push(this.initializeDataset(functions, data[graphs_container][graphs][functions][0],
  //             data[graphs_container][graphs][functions][1], data[graphs_container][graphs][functions][1], checkBool));
  //         }
  //         else {
  //           dataset_list.push(this.initializeDataset(functions, data[graphs_container][graphs][functions][0],
  //             data[graphs_container][graphs][functions][1], data[graphs_container][graphs][functions][1], true));
  //         }
  //         iterator = iterator + 1;
  //       }
  //     }
  //     //this allocates the graphs into the canvases in the html
  //     if (dataset_list.length > 0) {
  //       this.initializeGraph("canvas" + i, dataset_list, x_axis, yLabel, this.description_temp);
  //       var canvas = <HTMLCanvasElement>document.getElementById("canvas" + (i));
  //       var context = canvas.getContext("2d");
  //       dataset_list = [];
  //       iterator = 0;
  //       i = i + 1;
  //     }
  //   }
  // }

  // This function will send the user input (# of students) and receive all the
  // necessary data to create the desired graphs
  // NOTE: In order to make this function easier to read, parts of the code have been
  // converted into functions to reduce the overall size of this function
  private getGraphArr(userInput) {
    // resetting description_temp variable
    //logs in the console what is being received
    this.http.get(`http://localhost:8000/getPredictionData/${this.cohortService.cohort.studentType}/${this.cohortService.cohort.cohortYear}/${this.cohortService.cohort.academicType}`).subscribe(data => {
      //set the variables based on our request for the prediction values
      this.higherEdId = data["higherEdId"];
      var metaData = data["MetaData"];
      this.userInput = metaData.numberOfStudents;
      this.sigma = parseFloat(metaData.sigma).toFixed(3);
      this.alpha = parseFloat(metaData.alpha).toFixed(3);
      this.beta = parseFloat(metaData.beta).toFixed(3);
      
      this.graphService.displayGraph(data, false);
      //Hide cohort input when charts show
      // this.hideSelectCohort = false;
      //Shows slider and greek leeters fields
      this.showChartOptionalInputs = true;
      this.vps.scrollToAnchor("scrollToView");
    }
    );

  }
  // this function helps reducing the code int the getGraphArr function
  // the data returned is a component necessary to build the entire chart
  // private initializeDataset(_label, _data, _backgroundColor, _borderColor, _showLineBool) {
  //   // let shape = _showLineBool ? "circle" : "star";
  //   let shapeBackground = _showLineBool ? _backgroundColor : "#e9ecef";
  //   var ans = { "label": _label, "data": _data, "backgroundColor": _backgroundColor, "borderColor": _borderColor, "fill": false, "showLine": _showLineBool, "pointStyle": "circle", "pointBackgroundColor": shapeBackground };
  //   return ans;
  // }
  // using the smaller components, the entire chart is built. The purpose of this
  // function is to reduce the size of getGraphArr
  // private initializeGraph(id, _datasets, _labels, yAxisLabel, title) {
  //   this.chart = new Chart(id, {
  //     type: 'line',
  //     data: {
  //       // labels: [0.0, 1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0, 11.0, 12.0, 13.0, 14.0, 15.0],
  //       labels: _labels,
  //       datasets: _datasets,
  //     },
  //     options: {

  //       title: {
  //         display: true,
  //         text: title,
  //         position: 'bottom'
  //       },
  //       scales: {
  //         yAxes: [{
  //           scaleLabel: {
  //             display: true,
  //             labelString: yAxisLabel
  //           }
  //         }],
  //         xAxes: [{
  //           scaleLabel: {
  //             display: true,
  //             labelString: 'Time (Semesters)'
  //           }
  //         }]
  //       }
  //     }
  //   })
  //   this.list_of_charts.push(this.chart);
  // }

  // //this function is for testing purposes
  // private getGraphTest(userInput) {
  //   this.http.get(`http://localhost:8000/markov/` + userInput + `/`).subscribe(data => { console.log(data); });
  // }
  // //Not used
  // onUpdateServerName(event: any) {
  //   this.userInput = (<HTMLInputElement>event.target).value;
  // }

  //TODO rename this function to something else
  getCohort() {
    let steadyState = this.steadyState;

    if (isNaN(+this.sigma) || isNaN(+this.alpha) || isNaN(+this.beta)) {
      console.log("Error we got non numeric values")
      return;
    }
    this.http.get(`http://localhost:8000/getModifiedChartCohort/${this.userInput}/${this.sigma}/${this.alpha}/${this.beta}/${this.steadyState}/${this.higherEdId}`).subscribe(data => {
      //Reset greek letters shown in input both labels and editable values
      this.sigma = data["MetaData"]["sigma"];
      this.alpha = data["MetaData"]["alpha"];
      this.beta = data["MetaData"]["beta"];
      this.graphService.displayGraph(data, false);
    });
  }

  hideInputsAndChart() {
    this.showChartOptionalInputs = false;
    // This loop destorys the previously stored data to make sure there is
    // no overlap betwee old data and new data
    for (let i = 0; i < this.graphService.list_of_charts.length; i++) {
      this.graphService.list_of_charts[i].destroy();
    }
    this.graphService.list_of_charts = [];
    this.steadyState = "False";
    this.sigma = "";
    this.alpha = "";
    this.beta = "";

  }

}
