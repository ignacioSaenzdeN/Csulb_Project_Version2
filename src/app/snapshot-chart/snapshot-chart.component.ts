import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService, AuthenticationService, AlertService } from '../_services';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-snapshot-chart',
  templateUrl: './snapshot-chart.component.html',
  styleUrls: ['./snapshot-chart.component.less']
})
export class SnapshotChartComponent implements OnInit {
  academicLabel:string[];
  academicType:string[];

  academicLabelSelected:string = "";
  academicTypeSelected:string = "";

  snapshotYear:string = "21";

  queryGraphs: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private http: HttpClient,
    private router: Router,
  ) {}

  ngOnInit() {
    if (this.authenticationService.currentUserValue && this.authenticationService.isTokenValid() ) {
        this.router.navigate(['/snapshot-chart']);
    }else{
        this.authenticationService.logout();
        this.router.navigate(['/']);
    }
    this.createForm();
    this.getAcademicLabel();
  }

      //Helper function reset the state of the select of form selections when changing the combination
      resetForms(academicLabel, academicType){
        this.queryGraphs = this.formBuilder.group({
          academicLabel: [academicLabel, Validators.required],
          academicType: [academicType, Validators.required],
        });
      }
      //Helper function to reset the list of options for the dropdown menus when selecting a new combination
      resetMenuItems(academicLabel, academicType){
        this.academicLabel = academicLabel;
        this.academicType = academicType;
      }


    private createForm(){
      this.queryGraphs = this.formBuilder.group({
        academicLabel: ['', Validators.required],
        academicType: ['', Validators.required],
      });
    }
    getAcademicLabel(){
      this.resetForms(this.academicLabelSelected,'');
      this.resetMenuItems([], []);
      this.http.get(`http://localhost:8000/getAcademicLabelAll/${this.snapshotYear}/`).subscribe(data =>{
        console.log(data);
        this.academicLabel = Object.values(data).map(a => a);
      });
    }
    getAcademicType(){
      this.resetForms(this.academicLabelSelected,'');
      this.resetMenuItems(this.academicLabel, []);
      this.http.get(`http://localhost:8000/getAcademicTypelAll/${this.snapshotYear}/${this.academicLabelSelected}`).subscribe(data =>{
        console.log(data);
        this.academicType = Object.values(data).map(a => a);
      });
    }
}
