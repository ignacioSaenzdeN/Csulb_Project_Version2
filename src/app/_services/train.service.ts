import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { environment } from "@environments/environment";
import { Cohort } from "../_models";
import { GraphService } from "./graph.service";
import { AuthenticationService } from "../_services";
import { UploadService } from "./upload.service";

@Injectable({ providedIn: "root" })
export class TrainService {
  public uniqueID: any;
  public cohortamountOfStudents: string;
  public academicTypeSelected: String;
  public files = [];
  list_of_charts = [];

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private graphService: GraphService,
    private authenticationService: AuthenticationService,
    private uploadService: UploadService,
  ) {}

  ngOnInit() {}

  getFile() {
    this.http
      .get(
        `http://localhost:8000/getFiles/${this.authenticationService.getCurrentUser()}`
      )
      .subscribe((data) => {
        this.files = Object.values(data).map((a) => a);
      });
  }

  train() {
    this.http
      .post(`http://localhost:8000/train/`, {
        uniqueID: this.uniqueID,
        amountOfStudents: this.cohortamountOfStudents,
      })
      .subscribe((data) => {
        // to prevent the graphs from overlapping when the user trains the model multiple times, the variable are resetted
        for (let i = 0; i < this.list_of_charts.length; i++) {
          this.list_of_charts[i].destroy();
        }
        this.list_of_charts = [];
        this.graphService.displayGraph(data);
        // this.train_wait = false;
      });
  }

  //TODO: this function uploads the cohort selection before training based on dropdown
  uploadCohort() {
    this.http
      .post(`http://localhost:8000/uploadData/`, {
        data: null,
        yearTerm: null,
        academicType: null,
        studentType: null,
        amountOfStudents: null,
        academicLabel: null,
      })
      .subscribe((data) => {
        // to prevent the graphs from overlapping when the user trains the model multiple times, the variable are resetted
        for (let i = 0; i < this.list_of_charts.length; i++) {
          this.list_of_charts[i].destroy();
        }
        this.list_of_charts = [];
        this.graphService.displayGraph(data);
        // this.train_wait = false;
      });
  }

  extractCohortData() {
    var cohortData = this.uploadService.getCohortData();
    var studentSize = cohortData[this.academicTypeSelected]["HEADCOUNT"];
    var content = cohortData[this.academicTypeSelected];
  }
}
