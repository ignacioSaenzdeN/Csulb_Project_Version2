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
  }


    private createForm(){
      this.queryGraphs = this.formBuilder.group({
        academicLabel: ['', Validators.required],
        yearTerm: ['', Validators.required],
        academicType: ['', Validators.required],
      });
    }

}
