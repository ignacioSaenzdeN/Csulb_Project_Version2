import { Component, OnInit, Input} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService, AuthenticationService, AlertService } from '../../_services';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Options } from 'ng5-slider';
import { first } from 'rxjs/operators';
import {Chart} from 'chart.js';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.css']
})
export class UploadFileComponent  {
  // these variables are currently hardcoded but eventually they should be obtained through a get
  universities: string[];
  colleges:string[];
  departments:string[];

  // variables related to the form and the files uploaded to the form
  uploadForm: FormGroup;
  files: any = [];
  fileContent:object;
  ExcelData:any [][];
  ExcelDataObject:{} = {}
  studentType:string[];
  studentTypeSelected:string = "";
  cohortYear:string[];
  cohortYearSelected:string = "";
  cohortAcademicType:string[];
  cohortAcademicTypeSelected:string = "";
  // Ask if necesasary here or in this.uploadForm
  cohortamountOfStudents:string = "";

  //variables related to submission of form
  loading = false;
  submitted = false;
  // this is mainly for testing purposes
  uniqueID: any;
  // training charts
  list_of_charts=[];
  chart = Chart;
  
  //this boolean switches from the uploading form to the training section once the form is submitted
  upload_boolean=false;
  // bool that activates once the user click train
  train_wait=false;
  // bool that activates once the user confirms training
  accepted_bool=false;
  //Hides train component when a new selection is made
  showTrain = false;


  //slider Stuff
  value: number = 100;
  options: Options = {
    floor: 0,
    ceil: 2000
  };
  @Input('inputter') userInput :string;
  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private authenticationService: AuthenticationService,
    private router: Router,
    private userService: UserService,
    private alertService: AlertService
  ){}
  ngOnInit() {
    // if user is not validated, the user will be redirected to the login
    if (this.authenticationService.currentUserValue && this.authenticationService.isTokenValid()) {
        this.router.navigate(['/uploadView']);
    }else{
        this.authenticationService.logout();
        this.router.navigate(['/']);
    }
    // this prevents the slider from saying N/A or similar
    this.userInput="0";
    //this initializes the hardcoded variables; it should be deleted or modified eventually
    // this.set_variables();
    //initializes the form
    this.createForm();
  }// end of ngOnInit()



  private createForm(){
    this.uploadForm = this.formBuilder.group({
        studentTypeF: ['', Validators.required],
        yearTermF: ['', Validators.required],
        academicTypeF: ['', Validators.required],
        amountOfStudents: [ '', [Validators.required]],
        academicLabel: [ '', [Validators.required]],
        data: [ '', [Validators.required]],
      //  authorization: ['', Validators.required],
    });

  }
  // f() is just a shortcut to access the controls
    get f() { return this.uploadForm.controls; }

  // for the form submission
  onSubmit() {
      // Hides upload and corhor selection components when training is about to occur
      // this.isSubmitClicked = true;
      // this.showUpload = false;
      this.upload_boolean=true;
      console.log(this.ExcelDataObject);
      //Sets the object with cohort data and amount of students to be handled by the backend
      this.cohortamountOfStudents = this.ExcelDataObject[this.studentTypeSelected][this.cohortYearSelected][this.cohortAcademicTypeSelected]["HEADCOUNT"][0];
      this.fileContent = this.ExcelDataObject[this.studentTypeSelected][this.cohortYearSelected][this.cohortAcademicTypeSelected];
      console.log(this.fileContent)
      // it was easier to set the slider value and the file content this way
      this.uploadForm.controls.amountOfStudents.setValue(this.cohortamountOfStudents);
      this.uploadForm.controls.data.setValue(this.fileContent);
      this.uploadForm.controls.academicLabel.setValue(this.ExcelData[1][2].slice(3));
      this.submitted = true;
      this.alertService.clear();

      // if there are issues with any of the form fields, the submission will be rejected
      if (this.uploadForm.invalid) {
        console.log("is invalid");
        console.log(this.uploadForm.controls.studentTypeF);
        console.log(this.uploadForm.controls.yearTermF);
        console.log(this.uploadForm.controls.academicTypeF);
        console.log(this.uploadForm.controls.amountOfStudents);
        console.log(this.uploadForm.controls.academicLabel);
        console.log(this.uploadForm.controls.data);
          return;
      }
      console.log("is valid")
      console.log(  this.uploadForm.controls.studentTypeF.value);
      console.log(  this.uploadForm.controls.academicTypeF.value);
      console.log(  this.uploadForm.controls.yearTermF.value);
      console.log(  this.uploadForm.controls.amountOfStudents.value);
      console.log(this.uploadForm.controls.academicLabel);
      console.log(  this.uploadForm.controls.data.value);
      this.loading = true;

      // console.log("now it should work");
      // return;

      //this sends the form to the backend, in the front end we get the ID of the submission
      this.userService.upload(this.uploadForm.value)
          .pipe(first())
          .subscribe(
              data =>{
                console.log("unique ID");
                console.log(data);
                this.uniqueID= data;
               },
              error => {console.log("in error");this.loading = false;
              });

      console.log("sent");
      this.loading = false;
      this.showTrain = true;
  }

  // this should eventually not be hardcoded
  // private set_variables(){
  //     this.universities=['CSULB'];
  //     this.colleges= ['COE','CBA','CLA'];
  //     this.departments=[''];
  // }

  uploadFile(event){
    //let extension = event[0].name.split('.').pop();
    // technically we wil upload only one file at a time so this might not be necessary
    for (let index = 0; index < event.length; index++) {
      const element = event[index];
      this.files.push(element.name)
    }

    // this whole process is just to access the data inside the sheet of an Excel file
    // we have to go layer by layer like a russian doll
    const reader: FileReader = new FileReader();
    reader.onload =()=>{
      var content =reader.result as string;
      const file :XLSX.WorkBook = XLSX.read (content,{type:'binary'});
      const page1 : string = file.SheetNames[0];
      const page1_sheet :XLSX.WorkSheet = file.Sheets[page1];
      this.ExcelData = (XLSX.utils.sheet_to_json(page1_sheet, {header:1 }));
      console.log(this.ExcelData);
      console.log(this.ExcelData.length);
      console.log(this.ExcelData[0].length);
      // grab only number data accounts with 3 rows and 1 colum of labels
      var cohortStudent = "";
      var cohortYearTerm = "";
      var cohortAcademicType = "";
      var countType = "";
      for(var i = 2; i < this.ExcelData.length; i++){
        var tempArr = []
        for(var j = 4; j < this.ExcelData[i].length; j++){
          if(this.ExcelData[i][0] != cohortStudent){
            cohortStudent = this.ExcelData[i][0];
            this.ExcelDataObject[cohortStudent] = {};
          }
          if(this.ExcelData[i][1] != cohortYearTerm){
            cohortYearTerm = this.ExcelData[i][1];
            this.ExcelDataObject[cohortStudent][cohortYearTerm] = {};
          }
          if(this.ExcelData[i][2] != cohortAcademicType){
            cohortAcademicType = this.ExcelData[i][2];
            this.ExcelDataObject[cohortStudent][cohortYearTerm][cohortAcademicType] = {};
          }
          if(this.ExcelData[i][3] != countType){
            countType = this.ExcelData[i][3].slice(3);
            this.ExcelDataObject[cohortStudent][cohortYearTerm][cohortAcademicType][countType] = tempArr;
          }
          this.ExcelDataObject[cohortStudent][cohortYearTerm][cohortAcademicType][countType].push(this.ExcelData[i][j]);
        }
      } 
      this.studentType =  Object.keys(this.ExcelDataObject);
    }
    
    // after this function is called, onload is activated.
    reader.readAsBinaryString(event[0]);

  }

  //deletes an uploaded file from the list
  deleteAttachment(index) {
    console.log("here")
    this.files.splice(index, 1)
  }


  onUpdateSlider (event: any){
    this.userInput = (<HTMLInputElement>event.target).value;
  }

// these two functions just assign what the user chose to the form
 onUpdateUniversity (event: any){
  this.uploadForm.controls.studentTypeF.setValue((<HTMLInputElement>event.target).value);
}
onUpdateDepartment (event: any){
  this.uploadForm.controls.academicTypeF.setValue((<HTMLInputElement>event.target).value);
}
// train (){
//   this.http.post(`http://localhost:8000/train/`, {'uniqueID':this.uniqueID,'amountOfStudents':this.userInput}).subscribe(data =>{console.log(data);});
// }
// As it can be deduced by the function name, the purpose of the following code is to
// train the model
train (){
  this.train_wait=true;
  console.log(this.cohortYearSelected, this.studentTypeSelected, this.cohortAcademicTypeSelected)
  console.log(this.uniqueID, this.cohortamountOfStudents)
  this.http.post(`http://localhost:8000/train/`, {'uniqueID':this.uniqueID,'amountOfStudents':this.cohortamountOfStudents}).subscribe(data =>{
    console.log(data);
    // to prevent the graphs from overlapping when the user trains the model multiple times, the variable are resetted
    for (i = 0; i <this.list_of_charts.length ; i++){
      this.list_of_charts[i].destroy();
    }

    this.list_of_charts=[];

    var x_axis=[];
    var dataset_list = [];
    //this for loop will get each of the graphs
    var charts,graphs,functions;
    // the colors are not used as we switched to colorblind-friendly colors
    var colors=['red','blue','purple','yellow','black','brown','Crimson','Cyan','DarkOrchid'];
    var canvases = ['canvas','canvas1','canvas2','canvas3','canvas4','canvas5'];
    var iterator =0;
    var graphs_container = "Figures";
    var description="default";
    var i =1;
    //please refers to the charts component to unserstand this logic.
    // SUMMARY: the charts data is received as single points in json objects
    // the function goes layer by layer, collects the points and then creates a graph
        for (let graphs in data){
          if (graphs=="figure3"){
          for (functions in data[graphs]){
            if (functions == "x-axis"){
              x_axis = data[graphs][functions];
            }else if(functions=="description"){
              description=functions;
            }else{
              dataset_list.push( this.initializeDataset(functions, data[graphs][functions][0],
              data[graphs][functions][1],data[graphs][functions][1])  );
              iterator = iterator +1;
            }
          }
          if (dataset_list.length>0){
            console.log("dataset_list")
            console.log(dataset_list)
            console.log("x_axis")
            console.log(x_axis)
            this.initializeGraph("canvas"+i,dataset_list,x_axis);
            dataset_list=[];
            iterator=0;
            i=i+1;
          }
        }
      }
        this.train_wait=false;
        console.log("Data")
        console.log(data);
  });

}
// just to output a confirmation message in the html
private accepted(){
  this.accepted_bool=true;
}

// To following two functions are originally fromt the charts component.
// The code was copied as it was a small addition and it allows developers to
// easily understand the training function
// to make the chart code shorter and more understandable
private initializeDataset (_label,_data, _backgroundColor, _borderColor){
  var ans ={"label": _label , "data":_data, "backgroundColor":_backgroundColor, "borderColor": _borderColor,"fill": false};
  return ans;
}
// to make the chart code shorter and more understandable
// to learn more about the charts, refer to chart.js
private initializeGraph (id,_datasets, _labels){
  this.chart = new Chart (id,{
    type:'line',
    data: {
      labels: _labels,
      datasets:_datasets,
    },
    options : {
      scales: {
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Persistance, Retention, and Graduation (%)'
          }
        }],
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Time'
          }
        }]
      }
    }
    
  })
  this.list_of_charts.push(this.chart);
}

// this eventually should not be hardcoded
// based on the input of the college, the departments of the college would change
// this will be done through a get request to the backend most likely.
  // onUpdateCollege (event: any){
  //   this.uploadForm.controls.collegeName.setValue((<HTMLInputElement>event.target).value);
  //   if (this.uploadForm.controls.collegeName.value =="COE"){
  //     this.departments=['','CECS','CECEM','EE'];
  //   }else if (this.uploadForm.controls.collegeName.value =="CBA"){
  //     this.departments=['','finance','business administration'];
  //   }else if (this.uploadForm.controls.collegeName.value =="CLA"){
  //     this.departments=['','psychology'];
  //   }else{
  //     this.departments=['click again'];
  //   }
  // }

  setCohorYearType(){
    this.uploadForm = this.formBuilder.group({
      studentTypeF: [this.studentTypeSelected, Validators.required],
      yearTermF: ['', Validators.required],
      academicTypeF: ['', Validators.required],
      amountOfStudents: [ '', [Validators.required]],
      academicLabel: [ '', [Validators.required]],
      data: [ '', [Validators.required]],
    //  authorization: ['', Validators.required],
  });
    console.log(this.studentTypeSelected)
    this.cohortYear = Object.keys(this.ExcelDataObject[this.studentTypeSelected]);
  }
  setAcademicType(){
    this.uploadForm = this.formBuilder.group({
      studentTypeF: [this.studentTypeSelected, Validators.required],
      yearTermF: [this.cohortYearSelected, Validators.required],
      academicTypeF: ['', Validators.required],
      amountOfStudents: [ '', [Validators.required]],
      academicLabel: [ '', [Validators.required]],
      data: [ '', [Validators.required]],
    //  authorization: ['', Validators.required],
  });
    this.cohortAcademicType = Object.keys(this.ExcelDataObject[this.studentTypeSelected][this.cohortYearSelected]);
  }

  clearOnSelect(){
    // this.upload_boolean = false
    this.showTrain = false;

    for (let i = 0; i <this.list_of_charts.length ; i++){
      this.list_of_charts[i].destroy();
    }

    this.list_of_charts=[];

  }

  resetOnNewSubmit(){
    //These are 2 flags to control the flow of the options are shown un the upload component
    this.upload_boolean = false
    this.showTrain = false;


    //Resets data of uploaded file
    this.files = [];
    this.fileContent = {};
    this.ExcelDataObject = {};
    

    //Restets data associated with drop down menu for upload
    this.studentType = [];
    this. studentTypeSelected  = "";
    this.cohortYear = [];
    this.cohortYearSelected = "";
    this.cohortAcademicType = [];
    this.cohortAcademicTypeSelected = "";

    //Resets the charts
    for (let i = 0; i <this.list_of_charts.length ; i++){
      this.list_of_charts[i].destroy();
    }

    this.list_of_charts=[];

    

  }

}
