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
  queryGraphs: FormGroup;
  cohortYear:string[];
  constructor(
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private http: HttpClient,
    private router: Router,
  ) { }

  ngOnInit() {
    if (this.authenticationService.currentUserValue && this.authenticationService.isTokenValid() ) {
        this.router.navigate(['/snapshot-chart']);
    }else{
        this.authenticationService.logout();
        this.router.navigate(['/']);
    }
    this.createForm();
    this.getYearTerm();
  }


    private createForm(){
      this.queryGraphs = this.formBuilder.group({
        academicLabel: ['', Validators.required],
        yearTerm: ['', Validators.required],
        academicType: ['', Validators.required],
      });
    }
    getYearTerm(){
      // this.resetForms('', this.studentTypeSelected, '', '');
      // this.resetMenuItems([], [], []);
      // this.list_of_charts=[];
      this.http.get(`http://localhost:8000/getYearTermAll/`).subscribe(data =>{
        console.log(data);
        this.cohortYear = Object.values(data).map(a => a.yearTerm);
      });
    }
    getAcademicLabel(){
      // TODO
      // this.resetForms('', this.studentTypeSelected, this.cohortYearSelected, '');
      // this.resetMenuItems([], this.cohortYear, []);
      // this.http.get(`http://localhost:8000/getAcademicLabel/${this.studentTypeSelected}/${this.cohortYearSelected}`).subscribe(data =>{
      //   this.academicLabel = Object.values(data).map(a => a.academicLabel);
      // });
    }
}
