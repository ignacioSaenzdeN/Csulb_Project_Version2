import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { environment } from "@environments/environment";
import { Cohort } from "../_models";
import { GraphService } from "./graph.service";
import { AuthenticationService } from "../_services";
import { UploadService } from "./upload.service";
import { cpuUsage } from "process";
import { File } from "../_models";

@Injectable({ providedIn: "root" })
export class TrainService {
  public file = new File();
  // public cohortData: object;
  public uniqueID: any;
  public cohort = new Cohort();
  public queriedFilesNames: any = [];
  public academicTypesLabels: string[] = [];
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
    private uploadService: UploadService
  ) {}

  // ngOnInit() {
  //   //console.log(this.uploadService.file.fileName);
  //   this.cohort.data = this.getCohortData();
  //   console.log(this.cohort.data);
  //   //this.cohort.academicLabel = this.uploadService.csvData[1][2].slice(3);
  //   //console.log(this.cohort.academicLabel)
  //   //this.cohort.numOfStudents =  this.cohort.data["HEADCOUNT"][0];
  //   //console.log(this.cohort.numOfStudents);
  //   // this.cohort.academicLabel =
  //   // this.academicLabelSelected =  this.uploadService.csvData[1][2].slice(3);
  // }

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
        this.file.pubDate = data[0]["pubDate"];
        // Need to access data from http request
        // calling getCohortData here makes sure that we get the data before modifying it
        this.cohort.data = this.getCohortData();
        this.academicTypesLabels = Object.keys(this.cohort.data);

        // Getting the cohort data after use selects the file for training
        this.cohort.academicLabel = data[0]["academicLabel"];
        this.cohort.studentType = Object.keys(this.file.data)[0];
        this.cohort.cohortYear = Object.keys(this.file.data[this.cohort.studentType])[0];
      });
  }

  getCohortHeadcount(){
    this.cohort.data = this.cohort.data[this.cohort.academicType];
    // Gets the headcount after user selectes the academic type
    this.cohort.numOfStudents = this.file.data[this.cohort.studentType][this.cohort.cohortYear][this.cohort.academicType]["HEADCOUNT"][0];
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
        uniqueID: this.uniqueID,
        amountOfStudents: this.cohort.numOfStudents,
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
      .post(`http://localhost:8000/uploadCohort/`, {
        data: this.cohort,
        //studentType: this.uploadService.studentType,
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

  // extractCohortData() {
  //   var cohortData = this.getCohortData();
  //   var studentSize = cohortData[this.cohort.academicType]["HEADCOUNT"];
  //   var content = cohortData[this.cohort.academicType];
  // }
}
