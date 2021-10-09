import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService, AuthenticationService, AlertService } from '../_services';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Options } from 'ng5-slider';
import { Chart } from 'chart.js';
import { UploadService } from '../_services/upload.service';
import { TrainService } from '../_services/train.service';
import { GraphService } from '../_services/graph.service';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.css']
})
export class UploadFileComponent {
  // these variables are currently hardcoded but eventually they should be obtained through a get
  universities: string[];
  colleges: string[];
  departments: string[];

  // variables related to the form and the files uploaded to the form
  uploadForm: FormGroup;
  files: any = [];
  fileContent: object;
  csvData: any[][];
  //uploadService.csvDataObject: {} = {}
  studentType: string[];
  fileDropdownSelected: string = "";
  cohortYear: string[];
  cohortYearSelected: string = "";
  cohortAcademicType: string[];
  cohortAcademicTypeSelected: string = "";
  // Ask if necesasary here or in this.uploadForm
  cohortamountOfStudents: string = "";

  //variables related to submission of form
  loading = false;
  submitted = false;
  // this is mainly for testing purposes
  uniqueID: any;
  // training charts
  list_of_charts = [];
  chart = Chart;

  //this boolean switches from the uploading form to the training section once the form is submitted
  uploadBoolean = false;
  trainBoolean = false;
  // bool that activates once the user click train
  train_wait = false;
  // bool that activates once the user confirms training
  accepted_bool = false;
  //Hides train component when a new selection is made
  showTrain = false;


  headCount = 0;

  //slider Stuff
  value: number = 100;
  options: Options = {
    floor: 0,
    ceil: 2000
  };
  constructor(
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private router: Router,
    private userService: UserService,
    private alertService: AlertService,
    private uploadService: UploadService,
    private trainService: TrainService,
    private graphService: GraphService,
  ) { }
  ngOnInit() {
    // if user is not validated, the user will be redirected to the login
    if (this.authenticationService.currentUserValue && this.authenticationService.isTokenValid()) {
      this.router.navigate(['/uploadView']);
    } else {
      this.authenticationService.logout();
      this.router.navigate(['/']);
    }
    // Clear studentType array to hide dropdown menu
    //this.uploadService.studentType = [];
    //this initializes the hardcoded variables; it should be deleted or modified eventually
    //initializes the form
    this.createForm();
  }// end of ngOnInit()



  private createForm() {
    this.uploadForm = this.formBuilder.group({
      fileDropdown: ['', Validators.required],
      yearTermF: ['', Validators.required],
      academicTypeF: ['', Validators.required],
      amountOfStudents: ['', [Validators.required]],
      academicLabel: ['', [Validators.required]],
      data: ['', [Validators.required]],
    });

  }
  // f() is just a shortcut to access the controls
  get f() { return this.uploadForm.controls; }

  // for the form submission
  onSubmit() {
    // Hides upload and cohort selection components when training is about to occur
    // this.uploadBoolean = true;
    // //Sets the object with cohort data and amount of students to be handled by the backend
    // console.log(this.uploadService)
    // console.log("year")
    // console.log(this.cohortYearSelected);
    // this.cohortamountOfStudents = this.uploadService.csvDataObject[this.studentTypeSelected][this.cohortYearSelected][this.cohortAcademicTypeSelected]["HEADCOUNT"][0];
    // this.fileContent = this.uploadService.csvDataObject[this.studentTypeSelected][this.cohortYearSelected][this.cohortAcademicTypeSelected];
    // // it was easier to set the slider value and the file content this way
    // this.uploadForm.controls.amountOfStudents.setValue(this.cohortamountOfStudents);
    // this.uploadForm.controls.data.setValue(this.fileContent);
    // this.uploadForm.controls.academicLabel.setValue(this.uploadService.csvData[1][2].slice(3));
    // this.submitted = true;
    // this.alertService.clear();

    // if there are issues with any of the form fields, the submission will be rejected
    if (this.uploadForm.invalid) {
      return;
    }
    this.loading = true;


    //this sends the form to the backend, in the front end we get the ID of the submission
    // used to identify the higherEdDatabase Object
    this.userService.upload(this.uploadForm.value).subscribe(data => {
      this.uniqueID = data;
      this.trainService.train();
    },
      error => {
        console.log("in error"); this.loading = false;
      })


    this.loading = false;
    this.showTrain = true;
  }

  
  uploadBoolSwitch(){
    if(this.uploadBoolean){
      this.uploadBoolean = false;
    }
    else{
      this.uploadBoolean = true;
    }
  }

  trainBoolSwitch(){
    if(this.trainBoolean){
      this.trainBoolean = false;
    }
    else{
      this.trainBoolean = true;
    }
  }

  private accepted() {
    this.accepted_bool = true;
  }

  clearOnSelect() {
    this.showTrain = false;
    for (let i = 0; i < this.list_of_charts.length; i++) {
      this.list_of_charts[i].destroy();
    }
    this.list_of_charts = [];
  }

}
