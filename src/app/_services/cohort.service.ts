import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '@environments/environment';
import { Cohort } from '../_models';


@Injectable({providedIn: 'root'})
export class CohortService {
    public cohort = new Cohort();
    public queryGraphs: FormGroup;
    // public fileName: string;
    public studentTypeArr: string[] = ["FRESHMEN", "TRANSFER"];
    public cohortYearArr: string[];
    public academicLabelArr: string[];
    public cohortAcademicTypeArr: string[];
    public fileNameArr: string[];
    constructor( private http: HttpClient, private formBuilder: FormBuilder,) {
    }

    ngOnInit(){
    }

    createForm() {
        this.queryGraphs = this.formBuilder.group({
          studentType: ['', Validators.required],
          yearTerm: ['', Validators.required],
          academicLabel: ['', Validators.required],
          academicType: ['', Validators.required],
        });
      }

    resetForms(studentType, yearTerm, academicLabel, academicType) {
        this.queryGraphs = this.formBuilder.group({
          studentType: [studentType, Validators.required],
          yearTerm: [yearTerm, Validators.required],
          academicLabel: [academicLabel, Validators.required],
          academicType: [academicType, Validators.required],
        });
    }
    
    clearDropDown(){
        this.cohort.academicLabel = '';
        this.cohort.academicType = '';
        this.cohort.cohortYear = '';
        this.cohort.studentType = '';
    }

    resetMenuItems(cohortYear, cohortAcademicLabel, cohortAcademicType) {
        this.cohortYearArr = cohortYear;
        this.academicLabelArr = cohortAcademicLabel;
        this.cohortAcademicTypeArr = cohortAcademicType;
    }
    
    
    getYearTerm() {
        this.cohort.academicType = '';
        this.cohort.academicLabel = '';
        this.cohort.cohortYear = '';
        //this.cohortYearArr = []
        // before calling getYearTerm make sure you resetForm
        this.resetForms(this.cohort.studentType, '', '', '');
        this.resetMenuItems([], [], []);
        //TODO: implement way to desetroy charts in charts service
        // for (let i = 0; i < this.list_of_charts.length; i++) {
        //   this.list_of_charts[i].destroy();
        // }
        //this.list_of_charts = [];
        //this.hideInputsAndChart();

        this.http.get(`http://localhost:8000/getYearTerm/${this.cohort.studentType}`).subscribe(data => {
          this.cohortYearArr = Object.values(data).map(a => a.yearTerm);
        });

      }

      getAcademicType() {
        this.cohort.academicType = '';
   //TODO: implement way to desetroy charts in charts service
        // for (let i = 0; i < this.list_of_charts.length; i++) {
        //   this.list_of_charts[i].destroy();
        // }
        // this.list_of_charts = [];
        //TODO: call reset forms with the following layout
        this.resetForms(this.cohort.studentType, this.cohort.cohortYear, this.cohort.academicLabel, '');
        this.resetMenuItems(this.cohortYearArr, this.academicLabelArr, []);
         //TODO: find a way to call hideInputs and charts at some point here
        //this.hideInputsAndChart();
        this.http.get(`http://localhost:8000/getAcademicType/${this.cohort.studentType}/${this.cohort.cohortYear}/${this.cohort.academicLabel}`).subscribe(data => {
          this.cohortAcademicTypeArr = Object.values(data).map(a => a.academicType);
        });
      }

      getAcademicLabel() {
        this.cohort.academicLabel = '';
        //TODO: implement way to desetroy charts in charts service
        // for (let i = 0; i < this.list_of_charts.length; i++) {
        //   this.list_of_charts[i].destroy();
        // }
        // this.list_of_charts = [];
        //TODO: call reset forms with the following layout
        this.resetForms(this.cohort.studentType, this.cohort.cohortYear, '', '');
        this.resetMenuItems(this.cohortYearArr, [], []);
        //TODO: find a way to call hideInputs and charts at some point here
        //this.hideInputsAndChart();
        this.http.get(`http://localhost:8000/getAcademicLabel/${this.cohort.studentType}/${this.cohort.cohortYear}`).subscribe(data => {
          this.academicLabelArr = Object.values(data).map(a => a.academicLabel);
        });
      }
    
}



