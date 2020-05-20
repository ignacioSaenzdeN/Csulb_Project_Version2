import { Component, OnInit, Input} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService, AuthenticationService, AlertService } from '../../_services';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Options } from 'ng5-slider';
import { first } from 'rxjs/operators';
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
  loading = false;
  submitted = false;


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
        this.router.navigate(['/upload']);
    }else{
        this.router.navigate(['/']);
    }
    this.userInput="0";
    this.set_variables();
    this.createForm();

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
      this.uploadForm.controls.data.setValue(this.files);
      this.submitted = true;
      this.alertService.clear();
      // stop here if form is invalid
      if (this.uploadForm.invalid) {
          return;
      }
      // for (var temp in this.uploadForm.controls){
      //   console.log(this.uploadForm.controls[temp].value);
      // }
      console.log(  this.uploadForm.controls.universityName.value);
      console.log(  this.uploadForm.controls.departmentName.value);
      console.log(  this.uploadForm.controls.collegeName.value);
      console.log(  this.uploadForm.controls.amountOfStudents.value);
      console.log(  this.uploadForm.controls.data);
      console.log("it will be sent");
      this.loading = true;
      this.userService.upload(this.uploadForm.value)
          .pipe(first())
          .subscribe(
              data => {this.alertService.success('Registration successful', true);},
              error => {this.alertService.success('Registration successful', true);
                  this.loading = false;
              });
      console.log("it has been sent");
      this.loading = false;
  }
  private set_variables(){
      this.universities=['CSULB'];
      this.colleges= ['COE','CBA','CLA'];
      this.departments=[''];
      //.subscribe(data =>{console.log(data);})
  }
  uploadFile(event) {
    for (let index = 0; index < event.length; index++) {
      const element = event[index];
      this.files.push(element.name)
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
