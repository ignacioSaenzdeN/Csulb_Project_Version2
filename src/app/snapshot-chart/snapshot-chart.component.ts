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
  value: number = 100;
  options: Options = {
    floor: 0,
    ceil: 2000,
  };

  academicLabel: string[];
  academicType: string[];

  academicLabelSelected: string = "";
  academicTypeSelected: string = "";

  //TODO: change it so it grabs current year
  snapshotYear: string = "21";

  queryGraphs: FormGroup;

  showEditPredictCohort = true;

  // n1:string = ""
  // n2:string = ""
  // n3:string = ""
  // sigma1:string = "0"
  // sigma2:string = "0"
  // sigma3:string = ""
  // alpha1:string = ""
  // alpha2:string = ""
  // alpha3:string = ""
  // beta1:string = ""
  // beta2:string = ""
  // beta3:string = ""
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
    private graphService: GraphService,
    private snapshotService: SnapshotService
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
    this.createForm();
    this.getAcademicLabel();
  }

  dummyFunction() {
    console.log(this.userInputValues);
  }

  // private getGraphArr(userInput) {
  //   // resetting description_temp variable
  //   //logs in the console what is being received
  //   this.http
  //     .get(
  //       `http://localhost:8000/getSnapshotData/${this.snapshotYear}/${this.academicTypeSelected}`
  //     )
  //     .subscribe((data) => {
  //       //set the variables based on our request for the prediction values

  //       this.graphService.displayGraph(data, false);
  //       this.showEditPredictCohort = true;
  //       // console.log("trimmed alpha is", this.alpha.substring(0,5))
  //       //Hide cohort input when charts show
  //       // this.hideSelectCohort = false;
  //       //Shows slider and greek leeters fields
  //     });
  // }

  //Helper function reset the state of the select of form selections when changing the combination
  resetForms(academicLabel, academicType) {
    this.queryGraphs = this.formBuilder.group({
      academicLabel: [academicLabel, Validators.required],
      academicType: [academicType, Validators.required],
    });
  }
  //Helper function to reset the list of options for the dropdown menus when selecting a new combination
  resetMenuItems(academicLabel, academicType) {
    this.academicLabel = academicLabel;
    this.academicType = academicType;
  }

  private createForm() {
    this.queryGraphs = this.formBuilder.group({
      academicLabel: ["", Validators.required],
      academicType: ["", Validators.required],
    });
  }

  hideInputsAndChart() {
    //  this.showEditPredictCohort = false;
    // This loop destorys the previously stored data to make sure there is
    // no overlap betwee old data and new data
    for (let i = 0; i < this.graphService.list_of_charts.length; i++) {
      this.graphService.list_of_charts[i].destroy();
    }
    this.graphService.list_of_charts = [];


  }

  getAcademicLabel() {
    this.resetForms(this.academicLabelSelected, "");
    this.resetMenuItems([], []);
    this.http
      .get(
        `http://localhost:8000/getAcademicLabelFromYearAll/${this.snapshotYear}/`
      )
      .subscribe((data) => {
        console.log(data);
        var temp = [];
        for (var index in data) {
          for (var labelAndType of data[index]) {
            this.labelAndTypeList.push(labelAndType);
            var temp_var = labelAndType["academicLabel"];
            if (!temp.includes(temp_var)) temp.push(temp_var);
          }
        }
        this.academicLabel = temp;
        // this.academicLabel = Object.values(data).map(a => a['academicLabel']);
      });
  }

  getAcademicType() {
    //this.showEditPredictCohort = false;
    this.resetForms(this.academicLabelSelected, "");
    this.resetMenuItems(this.academicLabel, []);
    var temp = [];
    for (let labelAndType of this.labelAndTypeList)
      if (
        this.academicLabelSelected === labelAndType["academicLabel"] &&
        !temp.includes(labelAndType["academicType"])
      )
        temp.push(labelAndType["academicType"]);
    this.academicType = temp;
  }
}
