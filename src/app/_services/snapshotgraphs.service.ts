import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AuthenticationService } from "../_services";

@Injectable({ providedIn: "root" })
export class SnapshotService {
    constructor( private http: HttpClient,) {
    }

    academicLabel:string[];
    academicType:string[];
  
    academicLabelSelected:string = "";
    academicTypeSelected:string = "";

    dummy = 1;

    predictedAvgData:any;

    getPredictedAvgValues(){
        this.http.get(`http://localhost:8000/getPredictedValues/`).subscribe(data => {
            this.predictedAvgData = data;
          });
    
    }
   
}
