import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { AuthenticationService } from "../_services";
import { GraphService } from "./graph.service";
import { Form, FormBuilder, FormGroup, Validators } from "@angular/forms";

@Injectable({ providedIn: "root" })
export class SnapshotService {
  public freshmenData: Object;
  public transferData: Object;
  public academicLabel: string[];
  public academicType: string[];
  labelAndTypeList = [];

  public queryGraphs: FormGroup;
  createForm() {
    this.queryGraphs = this.formBuilder.group({
      academicLabel: ["", Validators.required],
      academicType: ["", Validators.required],
    });
  }

  snapshotYear: string = "21";
  // academicType:string = "FRESHMEN";

  academicLabelSelected: string = "";
  academicTypeSelected: string = "";
  modifiedXValues: [][];

  //dummy = 1;
  availableTermsToEdit = [];
  showEditPredictCohort = false;

  //The three 0's represent the three projected semesters. Might want to have a constant with predicted semesters size
  //predictedAvgData:any = [0, 0, 0];

  predictedAvgData: any = [
    {
      sigma: 0,
      beta: 0,
      alpha: 0,
      n: 0,
    },
    {
      sigma: 0,
      beta: 0,
      alpha: 0,
      n: 0,
    },
    {
      sigma: 0,
      beta: 0,
      alpha: 0,
      n: 0,
    },
    {
      sigma: 0,
      beta: 0,
      alpha: 0,
      n: 0,
    },
  ];

  constructor(
    private http: HttpClient,
    private graphService: GraphService,
    private formBuilder: FormBuilder
  ) {}

  clearDropDown() {
    this.academicLabelSelected = "";
    this.academicTypeSelected = "";
  }
  getPredictedAvgValues() {
    this.http
      .get(`http://localhost:8000/getPredictedValues/`)
      .subscribe((data) => {
        this.availableTermsToEdit = data[1];
        this.predictedAvgData = [
          {
            sigma: data[0][0].sigma,
            beta: data[0][0].beta,
            alpha: data[0][0].alpha,
            n: data[0][0].numberOfStudents,
          },
          {
            sigma: data[0][1].sigma,
            beta: data[0][1].beta,
            alpha: data[0][1].alpha,
            n: data[0][1].numberOfStudents,
          },
          {
            sigma: data[0][2].sigma,
            beta: data[0][2].beta,
            alpha: data[0][2].alpha,
            n: data[0][2].numberOfStudents,
          },
          {
            sigma: data[0][3].sigma,
            beta: data[0][3].beta,
            alpha: data[0][3].alpha,
            n: data[0][3].numberOfStudents,
          },
        ];
      });
  }

  resetForms(academicLabel, academicType) {
    this.queryGraphs = this.formBuilder.group({
      academicLabel: [academicLabel, Validators.required],
      academicType: [academicType, Validators.required],
    });
  }

  resetMenuItems(academicLabel, academicType) {
    this.academicLabel = academicLabel;
    this.academicType = academicType;
  }

  getLatestCohortYear() {
    this.http
      .get("http://localhost:8000/getLastestCohortYear/")
      .subscribe((data) => {
        console.log(data);
      });
  }

  getGraphArr(studentType, totalEnrollment) {
    // resetting description_temp variable
    //logs in the console what is being received
    this.http
      .get(
        `http://localhost:8000/getSnapshotData/${this.snapshotYear}/${this.academicTypeSelected}/${studentType}/${this.academicLabelSelected}/${totalEnrollment}`
      )
      .subscribe((data) => {
        if (studentType === "FRESHMEN") {
          this.freshmenData = data;
        } else {
          this.transferData = data;
        }
        //set the variables based on our request for the prediction values
        this.graphService.displayGraph(data, false, true);
        this.getPredictedAvgValues();
        this.showEditPredictCohort = true;
      });
  }

  getModifiedSnapshotData() {
    var predictedAvgDataStr = JSON.stringify(this.predictedAvgData);
    let params = new HttpParams().set("cohortValue", predictedAvgDataStr);
    this.http
      .get("http://localhost:8000/getModifiedSnapshotData/", { params })
      .subscribe((data) => {
        this.graphService.displayGraph(data, false, true);
      });
  }

  getAcademicLabel() {
    console.log("inside getacademiclabael");
    this.resetForms(this.academicLabelSelected, "");
    this.resetMenuItems([], []);
    this.http
      .get(
        `http://localhost:8000/getAcademicLabelFromYearAll/${this.snapshotYear}/`
      )
      .subscribe((data) => {
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

  getTotalEnrollment() {
    this.http
      .get(`http://localhost:8000/getTotalEnrollment/`)
      .subscribe((data) => {});
  }
}
