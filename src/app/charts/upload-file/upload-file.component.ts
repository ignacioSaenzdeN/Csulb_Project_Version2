import { Component, OnInit, Input} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService, AuthenticationService, AlertService } from '../../_services';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Options } from 'ng5-slider';
import { first } from 'rxjs/operators';
import {Chart} from 'chart.js';
@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.css']
})
export class UploadFileComponent  {
  universities: string[];
  colleges:string[];
  departments:string[];
  uploadForm: FormGroup;
  files: any = [];
  fileContent:string;
  loading = false;
  submitted = false;
  uniqueID: any;
  upload_boolean=true;
  list_of_charts=[];
  chart = Chart;
  train_wait=false;
  accepted_bool=false;
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
    if (this.authenticationService.currentUserValue) {
        this.router.navigate(['/uploadView']);
    }else{
        this.router.navigate(['/']);
    }
    this.userInput="0";
    this.set_variables();
    this.createForm();
    this.upload_boolean=true;
    console.log(this.upload_boolean);
  }// end of ngOnInit()



  private createForm(){
    this.uploadForm = this.formBuilder.group({
        universityName: ['', Validators.required],
        collegeName: ['', Validators.required],
        departmentName: ['', Validators.required],
        amountOfStudents: [ '', [Validators.required]],
        data: [ '', [Validators.required]],
      //  authorization: ['', Validators.required],
    });

      //.subscribe(data =>{console.log(data);})
  }
    get f() { return this.uploadForm.controls; }
  onSubmit() {
      this.uploadForm.controls.amountOfStudents.setValue(this.userInput);
      console.log("filecontent");
      console.log(this.fileContent);
      this.uploadForm.controls.data.setValue(this.fileContent);
      this.submitted = true;
      this.alertService.clear();

      console.log("valid?");
      if (this.uploadForm.invalid) {
          return;
      }
      console.log("valid");
      // for (var temp in this.uploadForm.controls){
      //   console.log(this.uploadForm.controls[temp].value);
      // }
      console.log(  this.uploadForm.controls.universityName.value);
      console.log(  this.uploadForm.controls.departmentName.value);
      console.log(  this.uploadForm.controls.collegeName.value);
      console.log(  this.uploadForm.controls.amountOfStudents.value);
      console.log(  this.uploadForm.controls.data.value);
      this.loading = true;

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
      this.upload_boolean=false;
      console.log(this.upload_boolean);
  }
  private set_variables(){
      this.universities=['CSULB'];
      this.colleges= ['COE','CBA','CLA'];
      this.departments=[''];
  }
  uploadFile(event) {
    console.log("uploadfile");
    for (let index = 0; index < event.length; index++) {
      const element = event[index];
      this.files.push(element.name)

      var reader = new FileReader();
      reader.onload = () => {
      this.fileContent= reader.result as string};
      reader.onloadend = () => {reader = null;};
      reader.readAsText( element);

    }
  }
  deleteAttachment(index) {
    this.files.splice(index, 1)
  }

  //slider
  onUpdateServerName (event: any){
    this.userInput = (<HTMLInputElement>event.target).value;
  }
 onUpdateUniversity (event: any){
  this.uploadForm.controls.universityName.setValue((<HTMLInputElement>event.target).value);
}
onUpdateDepartment (event: any){
  this.uploadForm.controls.departmentName.setValue((<HTMLInputElement>event.target).value);
}
// train (){
//   this.http.post(`http://localhost:8000/train/`, {'uniqueID':this.uniqueID,'amountOfStudents':this.userInput}).subscribe(data =>{console.log(data);});
// }
train (){
  this.train_wait=true;
  this.http.post(`http://localhost:8000/train/`, {'uniqueID':this.uniqueID,'amountOfStudents':this.userInput}).subscribe(data =>{
    console.log(data);

    for (i = 0; i <this.list_of_charts.length ; i++){
      this.list_of_charts[i].destroy();
    }
    this.list_of_charts=[];

    var x_axis=[];
    var dataset_list = [];
    //this for loop will get each of the graphs
    var charts,graphs,functions;
    var colors=['red','blue','purple','yellow','black','brown','Crimson','Cyan','DarkOrchid'];
    var canvases = ['canvas','canvas1','canvas2','canvas3','canvas4','canvas5'];
    var iterator =0;
    var graphs_container = "Figures";
    var description="default";
    var i =1;
    for(let dummt in data){
      console.log(dummt);
    }
    console.log("space");
        for (let graphs in data){
          console.log(graphs);
          if (graphs=="figure3"){
          for (functions in data[graphs]){
            if (functions == "x-axis"){
              x_axis = data[graphs][functions];
            }else if(functions=="description"){
              description=functions;
            }else{
              console.log(data[graphs][functions]);
              dataset_list.push( this.initializeDataset(functions, data[graphs][functions][0],
              data[graphs][functions][1],data[graphs][functions][1])  );
              iterator = iterator +1;
            }
          }
          if (dataset_list.length>0){
            this.initializeGraph("canvas"+i,dataset_list,x_axis);
            // var canvas = <HTMLCanvasElement>document.getElementById("canvas"+(i+1));
            // var context = canvas.getContext("2d");
            // context.font = "bold 16px Arial";
            // context.fillText(description, 100, 100);
            dataset_list=[];
            iterator=0;
            i=i+1;
          }
        }
      }
  });
}
private accepted(){
  this.accepted_bool=true;
}
private initializeDataset (_label,_data, _backgroundColor, _borderColor){
  var ans ={"label": _label , "data":_data, "backgroundColor":_backgroundColor, "borderColor": _borderColor,"fill": false};
  //console.log(ans);
  return ans;
}
private initializeGraph (id,_datasets, _labels){
  this.chart = new Chart (id,{
    type:'line',
    data: {
      // labels: [0.0, 1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0, 11.0, 12.0, 13.0, 14.0, 15.0],
      labels: _labels,
      datasets:_datasets,
    }
  })
  this.list_of_charts.push(this.chart);
}
//,'amountOfStudents':this.userInput}

  onUpdateCollege (event: any){
    this.uploadForm.controls.collegeName.setValue((<HTMLInputElement>event.target).value);
    if (this.uploadForm.controls.collegeName.value =="COE"){
      this.departments=['','CECS','CECEM','EE'];
    }else if (this.uploadForm.controls.collegeName.value =="CBA"){
      this.departments=['','finance','business administration'];
    }else if (this.uploadForm.controls.collegeName.value =="CLA"){
      this.departments=['','psychology'];
    }else{
      this.departments=['click again'];
    }
  }


}
