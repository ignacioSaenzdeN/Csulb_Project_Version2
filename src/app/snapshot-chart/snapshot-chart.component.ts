import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService, AuthenticationService, AlertService } from '../_services';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import {Chart} from 'chart.js';

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

  //this variable will include all the raw data from each set of graphs
  list_of_charts=[];
  // this variable will include the description of each of the graphs
  description_temp="";
  // title: 'Graph';
  chart = Chart;

  labelAndTypeList= [];
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

  private initializeGraph (id,_datasets, _labels, yAxisLabel, title){
    this.chart = new Chart (id,{
      type:'line',
      data: {
        //labels: [0.0, 1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0, 11.0, 12.0, 13.0, 14.0, 15.0],
        labels: _labels,
        datasets:_datasets,
      },
      options : {

        title: {
   display: true,
   text: title,
   position:'bottom'
  },
  scales: {
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: yAxisLabel
            }
          }],
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Time (Semesters)'
            }
          }]
        }
      }
    })
    this.list_of_charts.push(this.chart);
  }


  private initializeDataset (_label,_data, _backgroundColor, _borderColor, _showLineBool){
    // let shape = _showLineBool ? "circle" : "star";
    let shapeBackground = _showLineBool ? _backgroundColor : "#e9ecef";
    // console.log("shape");
    // console.log(shape);
    var ans = {"label": _label , "data":_data, "backgroundColor":_backgroundColor, "borderColor": _borderColor,"fill": false, "showLine": _showLineBool, "pointStyle": "circle", "pointBackgroundColor": shapeBackground};
    //console.log(ans);
    return ans;
  }
  private displayGraph(data){
    console.log(data)
    // this.description_temp = [];
    for (i = 0; i <this.list_of_charts.length ; i++){
      this.list_of_charts[i].destroy();
    }
    var yLabel = "";
    this.list_of_charts=[];

    var x_axis=[];
    var dataset_list = [];
    //this for loop will get each of the graphs
    var charts,graphs,functions;
    //var colors=['red','blue','purple','yellow','black','brown','Crimson','Cyan','DarkOrchid'];
    var canvases = ['canvas','canvas1','canvas2','canvas3','canvas4','canvas5'];
    var iterator =0;
    // the following strings need to match the values they have in the backend
    // to properly access the data.
    // the code below, starts decapsuling the data received from the backend
    // and stores the data from each layer in its corresponding variable.
    // The concept of the code below is similar to the russian dolls.
    // To better understand the structure of the data received, check \
    // the backend code
    var graphs_container = "Figures";
    var description="default";
    var i =1;
        for (let graphs in data[graphs_container]){
          for (functions in data[graphs_container][graphs]){
            if (functions == "x-axis"){
              x_axis = data[graphs_container][graphs][functions];
            }else if(functions=="description"){
              this.description_temp = (data[graphs_container][graphs][functions]);
              // +"\n"
            }else if(functions == 'yLabel'){
              yLabel = data[graphs_container][graphs][functions];
            }
            else{
              // console.log(data[graphs_container][graphs][functions]);
              if((graphs == "figure4") && (data[graphs_container][graphs][functions].length > 2)){
                let checkBool = (data[graphs_container][graphs][functions][2] === 'true')
                dataset_list.push( this.initializeDataset(functions, data[graphs_container][graphs][functions][0],
                  data[graphs_container][graphs][functions][1],data[graphs_container][graphs][functions][1], checkBool));
              }
              else{
                dataset_list.push( this.initializeDataset(functions, data[graphs_container][graphs][functions][0],
                data[graphs_container][graphs][functions][1],data[graphs_container][graphs][functions][1], true));
              }
              iterator = iterator +1;
            }
          }
          //this allocates the graphs into the canvases in the html
          if (dataset_list.length>0){
            this.initializeGraph("canvas"+i,dataset_list,x_axis, yLabel,this.description_temp);
            var canvas = <HTMLCanvasElement>document.getElementById("canvas"+(i));
            var context = canvas.getContext("2d");
            dataset_list=[];
            iterator=0;
            i=i+1;
          }
        }
  }
      private getGraphArr(userInput){
        // resetting description_temp variable
        //logs in the console what is being received
        this.http.get(`http://localhost:8000/getSnapshotData/${this.snapshotYear}/${this.academicTypeSelected}`).subscribe(data =>{
        //set the variables based on our request for the prediction values

        this.displayGraph(data);
        // console.log("trimmed alpha is", this.alpha.substring(0,5))
        //Hide cohort input when charts show
        // this.hideSelectCohort = false;
        //Shows slider and greek leeters fields

        }
        );

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
      this.http.get(`http://localhost:8000/getAcademicLabelFromYearAll/${this.snapshotYear}/`).subscribe(data =>{
        console.log(data);
        var temp = [];
        for (var index in data){
          for (var labelAndType of data[index]){
            this.labelAndTypeList.push(labelAndType);
            var temp_var =labelAndType['academicLabel'];
            if (!temp.includes(temp_var)) temp.push(temp_var);
          }
      }
        this.academicLabel = temp;
        // this.academicLabel = Object.values(data).map(a => a['academicLabel']);
      });
    }

    getAcademicType(){
      this.resetForms(this.academicLabelSelected, '')
      this.resetMenuItems(this.academicLabel, []);
      var temp =[]
      for (let labelAndType of this.labelAndTypeList )
        if (this.academicLabelSelected === labelAndType['academicLabel'] && !temp.includes(labelAndType['academicType']))
          temp.push(labelAndType['academicType'])
      this.academicType = temp;
    }
}
