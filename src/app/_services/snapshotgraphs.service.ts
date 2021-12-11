import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { AuthenticationService } from "../_services";
import { GraphService } from "./graph.service";

@Injectable({ providedIn: "root" })
export class SnapshotService {
    constructor( private http: HttpClient, private graphService: GraphService) {
    }

    snapshotYear: string = "21";
    academicLabel:string[];
    academicType:string[];
  
    academicLabelSelected:string = "";
    academicTypeSelected:string = "";
    modifiedXValues: [][];

    dummy = 1;

    //The three 0's represent the three projected semesters. Might want to have a constant with predicted semesters size
    //predictedAvgData:any = [0, 0, 0];

    predictedAvgData:any = [
      {
        sigma: 0,
        beta: 0,
        alpha: 0,
        n: 0,
      },
      {
        sigma: 0,
        beta: 0,
        alpha: 0,
        n: 0,
      },
      {
        sigma: 0,
        beta: 0,
        alpha: 0,
        n: 0,
      },
      {
        sigma: 0,
        beta: 0,
        alpha: 0,
        n: 0,
      },
      
    ];

    getPredictedAvgValues(){
        this.http.get(`http://localhost:8000/getPredictedValues/`).subscribe(data => {
          this.predictedAvgData = [
            {
              sigma: data[0].sigma,
              beta: data[0].beta,
              alpha: data[0].alpha,
              n: data[0].numberOfStudents,
            },
            {
              sigma: data[1].sigma,
              beta: data[1].beta,
              alpha: data[1].alpha,
              n: data[1].numberOfStudents,
            },
            {
              sigma: data[2].sigma,
              beta: data[2].beta,
              alpha: data[2].alpha,
              n: data[2].numberOfStudents,
            },
            {
              sigma: data[3].sigma,
              beta: data[3].beta,
              alpha: data[3].alpha,
              n: data[3 ].numberOfStudents,
            },
          ];
          });
    
    }

    private getGraphArr(userInput) {
      // resetting description_temp variable
      //logs in the console what is being received
      this.http
        .get(
          `http://localhost:8000/getSnapshotData/${this.snapshotYear}/${this.academicTypeSelected}`
        )
        .subscribe((data) => {
          //set the variables based on our request for the prediction values
  
          this.graphService.displayGraph(data, false);
          this.getPredictedAvgValues();
          // this.showEditPredictCohort = true;
          // console.log("trimmed alpha is", this.alpha.substring(0,5))
          //Hide cohort input when charts show
          // this.hideSelectCohort = false;
          //Shows slider and greek leeters fields
        });
    }

    private getModifiedSnapshotData(){
      var predictedAvgDataStr = JSON.stringify(this.predictedAvgData)
      let params = new HttpParams().set("cohortValue", predictedAvgDataStr)
      this.http.get('http://localhost:8000/getModifiedSnapshotData/', {params}) .subscribe((data) => {
        this.graphService.displayGraph(data, false);
      });
    }
  
   
}
