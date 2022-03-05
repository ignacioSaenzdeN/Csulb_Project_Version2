import { Component, OnInit, Input } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { UserService, AuthenticationService, AlertService } from "../_services";
import { GraphService } from "../_services/graph.service";
import { SnapshotService } from "../_services/snapshotgraphs.service";
import { HttpClient } from "@angular/common/http";
import { Router, ActivatedRoute } from "@angular/router";
import { Options } from "ng5-slider";
import { Chart } from "chart.js";

@Component({
  selector: "app-snapshot-chart",
  templateUrl: "./snapshot-chart.component.html",
  styleUrls: ["./snapshot-chart.component.less"],
})
export class SnapshotChartComponent implements OnInit {
  public isCollapsed = false;
  value: number = 100;
  options: Options = {
    floor: 0,
    ceil: 2000,
  };

  showTotalEnrollment: boolean;
  //This is not used to graph but rather to get the academic labels from the backend, 
  //TODO: change getter fucntion of 'getAcademicLabelFromYearAll' to not require a year to pull the labels
  snapshotYear: string = "21";

  queryGraphs: FormGroup;


  userInputValues: any = [
    {
      sigma: this.snapshotService.predictedAvgData[0]["sigma"],
      beta: this.snapshotService.predictedAvgData[0]["beta"],
      alpha: this.snapshotService.predictedAvgData[0]["alpha"],
      n: this.snapshotService.predictedAvgData[0]["numberOfStudents"],
    },
    {
      sigma: this.snapshotService.predictedAvgData[1]["sigma"],
      beta: this.snapshotService.predictedAvgData[1]["beta"],
      alpha: this.snapshotService.predictedAvgData[1]["alpha"],
      n: this.snapshotService.predictedAvgData[1]["numberOfStudents"],
    },
    {
      sigma: this.snapshotService.predictedAvgData[2]["sigma"],
      beta: this.snapshotService.predictedAvgData[2]["beta"],
      alpha: this.snapshotService.predictedAvgData[2]["alpha"],
      n: this.snapshotService.predictedAvgData[2]["numberOfStudents"],
    },
  ];
  predictionGroup: any;

  @Input("inputter") userInput1: string;
  @Input("inputter") userInput2: string;
  @Input("inputter") userInput3: string;

  labelAndTypeList = [];
  constructor(
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private http: HttpClient,
    private router: Router,
    public graphService: GraphService,
    public snapshotService: SnapshotService
  ) {}

  ngOnInit() {
    if (
      this.authenticationService.currentUserValue &&
      this.authenticationService.isTokenValid()
    ) {
      this.router.navigate(["/snapshot-chart"]);
    } else {
      this.authenticationService.logout();
      this.router.navigate(["/"]);
    }
    this.snapshotService.getAcademicLabel();
    this.snapshotService.clearDropDown();
    this.hideInputsAndChart();
    this.snapshotService.createForm();
  }

  hideInputsAndChart() {
    this.snapshotService.showEditPredictCohort = false
    // This loop destorys the previously stored data to make sure there is
    // no overlap betwee old data and new data
    for (let i = 0; i < this.graphService.list_of_charts.length; i++) {
      this.graphService.list_of_charts[i].destroy();
    }
    this.graphService.list_of_charts = [];
    this.snapshotService.availableTermsToEdit = []

  }


}
