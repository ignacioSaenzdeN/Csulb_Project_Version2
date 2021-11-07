import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { environment } from "@environments/environment";
import { Cohort } from "../_models";
import { GraphService } from "./graph.service";
import { AuthenticationService } from "../_services";
import { UploadService } from "./upload.service";
import { TrainComponent } from "../train/train.component";
import { cpuUsage } from "process";
import { File } from "../_models";
import * as moment from "moment";

@Injectable({ providedIn: "root" })
export class TrainService {
  public file = new File();
  // public cohortData: object;
  public uniqueID: any;
  public cohort = new Cohort();
  public queriedFilesNames: any = [];
  public academicTypesLabels: string[] = [];
  public formattedCohortData: object;
  public cohortUniqueId: string = "";
  public showTrain: Boolean = false;
  // public cohortamountOfStudents: string;
  // public academicTypeSelected: String;
  // public academicLabelSelected: String;
  // public studentType: String;
  public files = [];
  list_of_charts = [];

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private graphService: GraphService,
    private authenticationService: AuthenticationService,
    private uploadService: UploadService,
    private trainService: TrainService
  ) {}

  ngOnInit() {}

  getFilesNames() {
    this.http
      .get(
        `http://localhost:8000/getFilesNames/${this.authenticationService.getCurrentUser()}`
      )
      .subscribe((data) => {
        this.queriedFilesNames = Object.values(data).map((a) => a);
      });
  }

  getFile() {
    this.http
      .get(`http://localhost:8000/getFile/${this.file.fileName}`)
      .subscribe((data) => {
        this.file.data = JSON.parse(data[0]["data"].replace(/'/g, '"'));
        this.file.createdBy = data[0]["createdBy"];
        this.file.pubDate = moment(data[0]["pubDate"]).format(
          "MMMM Do YYYY, h:mm:ss a"
        );
        // Need to access data from http request
        // calling getCohortData here makes sure that we get the data before modifying it
        this.formattedCohortData = this.getCohortData();
        this.academicTypesLabels = Object.keys(this.formattedCohortData);

        // Getting the cohort data after use selects the file for training
        this.cohort.academicLabel = data[0]["academicLabel"];
        this.cohort.studentType = Object.keys(this.file.data)[0];
        this.cohort.cohortYear = Object.keys(
          this.file.data[this.cohort.studentType]
        )[0];
      });
  }

  getCohortHeadcount() {
    this.cohort.data = this.formattedCohortData[this.cohort.academicType];
    console.log(this.cohort.data);
    // Gets the headcount after user selectes the academic type
    this.cohort.numOfStudents =
      this.file.data[this.cohort.studentType][this.cohort.cohortYear][
        this.cohort.academicType
      ]["HEADCOUNT"][0];
  }

  getCohortData() {
    const fileName = this.file.fileName.split(" ");
    var studentType = fileName[1][0] === "F" ? "FRESHMEN" : "TRANSFER";
    var cohortYear;
    if (fileName[0][0] === "F") {
      cohortYear = "FALL " + fileName[0].slice(3);
    } else {
      cohortYear = "SPRING " + fileName[0].slice(3);
    }
    return this.file.data[studentType][cohortYear];
  }

  train() {
    this.http
      .post(`http://localhost:8000/train/`, {
        uniqueID: this.cohortUniqueId,
        amountOfStudents: this.cohort.numOfStudents,
        academicLabel: this.cohort.academicLabel,
      })
      .subscribe((data) => {
        // to prevent the graphs from overlapping when the user trains the model multiple times, the variable are resetted
        this.showTrain = true;
        for (let i = 0; i < this.list_of_charts.length; i++) {
          this.list_of_charts[i].destroy();
        }
        this.list_of_charts = [];
        this.graphService.displayGraph(data);
      });
  }

  //TODO: this function uploads the cohort selection before training based on dropdown
  uploadCohort() {
    console.log("this.cohort");
    console.log(this.cohort);
    this.http
      .post(`http://localhost:8000/uploadCohort/`, {
        data: this.cohort,
      })
      .subscribe((data) => {
        this.cohortUniqueId = String(data);
        // to prevent the graphs from overlapping when the user trains the model multiple times, the variable are resetted
        for (let i = 0; i < this.list_of_charts.length; i++) {
          this.list_of_charts[i].destroy();
        }
        this.list_of_charts = [];
        this.graphService.displayGraph(data);
        // this.train_wait = false;
        this.train();
      });
  }

  // extractCohortData() {
  //   var cohortData = this.getCohortData();
  //   var studentSize = cohortData[this.cohort.academicType]["HEADCOUNT"];
  //   var content = cohortData[this.cohort.academicType];
  // }
}
