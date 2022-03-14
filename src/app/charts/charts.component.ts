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

  // this variable will include the description of each of the graphs
  description_temp = "";

  // this id is used for querying the highereddatabase when we edit the cohor
  higherEdId = "";

  constructor(private http: HttpClient,
    private authenticationService: AuthenticationService,
    public cohortService: CohortService,
    public graphService: GraphService,
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

  // This function will send the user input (# of students) and receive all the
  // necessary data to create the desired graphs
  // NOTE: In order to make this function easier to read, parts of the code have been
  // converted into functions to reduce the overall size of this function
  public getGraphArr(userInput) {
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
      
      this.graphService.displayGraph(data, false, false);
      //Hide cohort input when charts show
      // this.hideSelectCohort = false;
      //Shows slider and greek leeters fields
      this.showChartOptionalInputs = true;
      this.vps.scrollToAnchor("scrollToView");
    }
    );

  }

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
      this.graphService.displayGraph(data, false, false);
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
