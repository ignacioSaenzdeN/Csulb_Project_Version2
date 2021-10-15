import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { environment } from "@environments/environment";
import { Cohort } from "../_models";
import { GraphService } from "./graph.service";
import { AuthenticationService } from "../_services";
import { UploadService } from "./upload.service";
import { cpuUsage } from "process";

@Injectable({ providedIn: "root" })
export class TrainService {
  public cohortData: object;
  public uniqueID: any;
  public cohort = new Cohort();
  public queriedFilesNames: any = [];
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

  ngOnInit() {
    //console.log(this.uploadService.file.fileName);
    //this.cohort.data = this.getCohortData();
    //this.cohort.academicLabel = this.uploadService.csvData[1][2].slice(3);
    //console.log(this.cohort.academicLabel)
    //this.cohort.numOfStudents =  this.cohort.data["HEADCOUNT"][0];
    //console.log(this.cohort.numOfStudents);
    // this.cohort.academicLabel = 
    // this.academicLabelSelected =  this.uploadService.csvData[1][2].slice(3);
    
  }

  // getCohortData() {
  //   const fileName = this.uploadService.file.fileName.split(" ");
  //   var studentType = fileName[1][0] === "F" ? "FRESHMEN" : "TRANSFER";
  //   var cohortYear;
  //   if (fileName[0][0] === "F") {
  //     cohortYear = "FALL " + fileName[0].slice(3);
  //   } else {
  //     cohortYear = "SPRING " + fileName[0].slice(3);
  //   }
  //   return this.uploadService.file.data[studentType][cohortYear];
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
      .post(`http://localhost:8000/uploadData/`, {
        // data: this.cohortData,
        // yearTerm: this.uploadService.file.data[""],
        // academicType: this.academicTypeSelected,
        // studentType: null,
        // amountOfStudents: this.cohortamountOfStudents,
        // academicLabel: this.academicLabelSelected,
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
    var studentSize = cohortData[this.cohort.academicType]["HEADCOUNT"];
    var content = cohortData[this.cohort.academicType];
  }
}
