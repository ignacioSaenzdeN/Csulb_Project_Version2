import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from '../_services';
import { Cohort } from '../_models';
import { File } from '../_models';
import * as XLSX from 'xlsx';


@Injectable({providedIn: 'root'})
export class UploadService {
    public file = new File();
    public reader: FileReader = new FileReader();
    public filesNames: any = [];
    public files: any = [];
    public csvData: any[][];
    public formatedData: any = [];
    public showTrain: boolean;
    public studentType: string[] = [];
    // public cohortYearArr: string[];
    // public academicLabelArr: string[];
    // public cohortAcademicTypeArr: string[];
    constructor( private http: HttpClient, private authenticationService: AuthenticationService) {
    }

    ngOnInit(){
    }
    
    uploadFile(){
      for(let i = 0; i < this.filesNames.length; i++){
        this.http.post(`http://localhost:8000/uploadCsv/`, { 'fileName': this.filesNames[i], 'data': this.formatedData[i], 'createdBy': this.authenticationService.getCurrentUser()}).subscribe(data => {});
      }
    }


    formatFile(event) {
        this.showTrain = false;
        // technically we will upload only one file at a time so this might not be necessary
        // TODO: not allow multiple uploads for deployment unless it is needed
        for (let index = 0; index < event.length; index++) {
          const element = event[index];
          this.formatFileName(element.name);
          //this.filesNames.push(element.name)
        }
        // this whole process is just to access the data inside the sheet of an Excel file
        // we have to go layer by layer like a russian doll
        // This data will contain elements such as Student Count, Persistance Count and similar
        // things
    
        this.reader.onload = () => {
          //Helps find name of files
          // console.log(this.files)
          var content = this.reader.result as string;
          // Convert the string content to a XLSX object
          const file: XLSX.WorkBook = XLSX.read(content, { type: 'binary' });
          const page1: string = file.SheetNames[0];
          // We get the relevant sheet (first sheet) out of the XLSX object
          const page1_sheet: XLSX.WorkSheet = file.Sheets[page1];
          // Break down the structure of the data sheet for easier access
          this.csvData = (XLSX.utils.sheet_to_json(page1_sheet, { header: 1 }));
          this.files.push(this.csvData);
          this.formatData();
        }
        // after this function is called, onload is activated.
        this.reader.readAsBinaryString(event[0]);
        console.log(this.filesNames.length)
    
      }
      formatFileName(fileName){
        var splitedName = fileName.split(/[.,\/_]/);
        var name = "";
        name += splitedName[0] + " " + splitedName[1] + " " + splitedName[2];
        this.filesNames.push(name);
       
      }

      formatData(){
        var csvDataObject: {} = {};
        var cohortStudent = "";
        var cohortYearTerm = "";
        var cohortAcademicType = "";
        var countType = "";
        for (var i = 2; i < this.csvData.length; i++) {
          var tempArr = []
          for (var j = 4; j < this.csvData[i].length; j++) {
            if (this.csvData[i][0] != cohortStudent) {
              cohortStudent = this.csvData[i][0];
              csvDataObject[cohortStudent] = {};
            }
            if (this.csvData[i][1] != cohortYearTerm) {
              cohortYearTerm = this.csvData[i][1];
              csvDataObject[cohortStudent][cohortYearTerm] = {};
            }
            if (this.csvData[i][2] != cohortAcademicType) {
              cohortAcademicType = this.csvData[i][2];
              csvDataObject[cohortStudent][cohortYearTerm][cohortAcademicType] = {};
            }
            if (this.csvData[i][3] != countType) {
              countType = this.csvData[i][3].slice(3);
              csvDataObject[cohortStudent][cohortYearTerm][cohortAcademicType][countType] = tempArr;
            }
            csvDataObject[cohortStudent][cohortYearTerm][cohortAcademicType][countType].push(this.csvData[i][j]);
          }
        }
        this.formatedData.push(csvDataObject);
        this.studentType = Object.keys(csvDataObject);
        this.showTrain = true;
      }



      deleteAttachment(index) {
        this.filesNames.splice(index, 1);
        this.files.splice(index, 1);
        this.formatedData.splice(index, 1);
      }
    
}



