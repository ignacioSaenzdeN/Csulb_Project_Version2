import { Component, OnInit, Input} from '@angular/core';
import {Chart} from 'chart.js';
import { UserService, AuthenticationService, AlertService } from '../_services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
//SliderModule
import { Options } from 'ng5-slider';
@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.less']
})
export class ChartsComponent implements OnInit {

  //slider stuff
  value: number = 100;
  options: Options = {
    floor: 0,
    ceil: 2000
  };
  queryGraphs: FormGroup;
    //this will contain queried data for the drop down menu
  academicLabel:string[];
  academicLabelSelected:string = "";
  studentType:string[] = ["FRESHMEN", "TRANSFER"];
  studentTypeSelected:string = "";
  cohortYear:string[];
  cohortYearSelected:string = "";
  cohortAcademicType:string[];
  cohortAcademicTypeSelected:string = "";
  
  //addition
  //this input will be the number of students
  @Input('inputter') userInput :string;

  // title: 'Graph';
  chart = Chart;

  //this variable will include all the raw data from each set of graphs
  list_of_charts=[];
  // this variable will include the description of each of the graphs
  description_temp="";

  constructor(private http: HttpClient,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private router: Router,
  ){}
  //if the user is logged in, the user will remain in ChartsComponent, the user
  // will be redirected to the login otherwise
  ngOnInit() {  
    if (this.authenticationService.currentUserValue && this.authenticationService.isTokenValid() ) {
        this.router.navigate(['/charts']);
    }else{
        this.authenticationService.logout();
        this.router.navigate(['/']);
    }
    // if graph must show at the beginning of anything put code here
    this.userInput="0";
    //initializes the form
    this.createForm();
  }// end of ngOnInit()

  private createForm(){
    this.queryGraphs = this.formBuilder.group({
      academicLabel: ['', Validators.required],
      studentType: ['', Validators.required],
      yearTerm: ['', Validators.required],
      academicType: ['', Validators.required],
    });
  }

  // f() is just a shortcut to access the controls
  get f() { return this.queryGraphs.controls; }
  //Demo graphs to see structure of a graph
    private getGraph(){
        this.http.get(`http://localhost:8000/markov/900/`).subscribe(data =>{console.log(data);});
        //.subscribe(data =>{console.log(data);})
        this.chart = new Chart ('canvas', {
          type:'line',
          data:{
            //labels are in one of the coordinatesEg: months (JAN,FEB,ETC.)
            labels:[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
            //datasets are the elements to be charted, the lines each {} is one line/function
            datasets:[{
              label: 'COE Enrolled',
              data: [0, 900, 834, 807, 785, 764, 743, 720, 698, 548, 337, 168, 67, 19, 2, 0],
              backgroundColor: 'red',
              borderColor: 'red',
              fill: false,
            },
            {
              label: 'COE graduating',
              data: [0, 0, 0, 0, 0, 0, 0, 164, 212, 155, 83, 34, 9, 0, 0, 0],
              backgroundColor: 'blue',
              borderColor: 'blue',
              fill: false,
            }//end of second dataset
          ]//end of dataset
          }//end of data
        })// enf of this.chart
        this.chart = new Chart ('canvas1', {
          type:'line',
          data:{
            //labels are in one of the coordinatesEg: months (JAN,FEB,ETC.)
            labels:[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
            //datasets are the elements to be charted, the lines each {} is one line/function
            datasets:[{
              label: 'COE Enrolled',
              data: [0, 900, 834, 807, 785, 764, 743, 720, 698, 548, 337, 168, 67, 19, 2, 0],
              backgroundColor: 'red',
              borderColor: 'red',
              fill: false,
            },
            {
              label: 'COE graduating',
              data: [0, 0, 0, 0, 0, 0, 0, 164, 212, 155, 83, 34, 9, 0, 0, 0],
              backgroundColor: 'blue',
              borderColor: 'blue',
              fill: false,
            }//end of second dataset
          ]//end of dataset
          }//end of data
        })// enf of this.chart
    }


// This function will send the user input (# of students) and receive all the
// necessary data to create the desired graphs
// NOTE: In order to make this function easier to read, parts of the code has been
// converted into functions to reduce the overall size of this function
    private getGraphArr(userInput){

        // resetting description_temp variable
        this.description_temp="";
        this.description_temp="Description of each figure: \n"
        //logs in the console what is being received
        this.http.get(`http://localhost:8000/markov/`+userInput+`/`).subscribe(data =>{
        console.log("chart component get data")
        console.log(data)
        // This loop destorys the previously stored data to make sure there is
        // no overlap betwee old data and new data
          for (i = 0; i <this.list_of_charts.length ; i++){
            this.list_of_charts[i].destroy();
          }
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
                console.log("graphs in data[graphs_container]")
                console.log(graphs)
                for (functions in data[graphs_container][graphs]){
                  console.log("functions in data[graphs_container][graphs]")
                  console.log(functions)
                  if (functions == "x-axis"){
                    x_axis = data[graphs_container][graphs][functions];
                  }else if(functions=="description"){
                    this.description_temp+=data[graphs_container][graphs][functions]+"\n";
                  }else{
                    // console.log(data[graphs_container][graphs][functions]);
                    dataset_list.push( this.initializeDataset(functions, data[graphs_container][graphs][functions][0],
                    data[graphs_container][graphs][functions][1],data[graphs_container][graphs][functions][1])  );
                    iterator = iterator +1;
                  }
                }
                //this allocates the graphs into the canvases in the html
                if (dataset_list.length>0){
                  this.initializeGraph("canvas"+i,dataset_list,x_axis);
                  var canvas = <HTMLCanvasElement>document.getElementById("canvas"+(i));
                  var context = canvas.getContext("2d");
                  dataset_list=[];
                  iterator=0;
                  i=i+1;
                }
              }
         }
        );
    }
    // this function helps reducing the code int the getGraphArr function
    // the data returned is a component necessary to build the entire chart
    private initializeDataset (_label,_data, _backgroundColor, _borderColor){
      var ans ={"label": _label , "data":_data, "backgroundColor":_backgroundColor, "borderColor": _borderColor,"fill": false};
      //console.log(ans);
      return ans;
    }
    // using the smaller components, the entire chart is built. The purpose of this
    // function is to reduce the size of getGraphArr
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

    //this function is for testing purposes
    private getGraphTest(userInput){
        this.http.get(`http://localhost:8000/markov/`+userInput+`/`).subscribe(data =>{console.log(data);});
        //.subscribe(data =>{console.log(data);})
    }
    //Not used
    onUpdateServerName (event: any){
      this.userInput = (<HTMLInputElement>event.target).value;
    }

    getStudentType(){
      console.log(this.studentTypeSelected);
      this.http.get(`http://localhost:8000/getYearTerm/${this.studentTypeSelected}`).subscribe(data =>{
        console.log(data);
        this.cohortYear = Object.values(data).map(a => a.yearTerm);
        console.log(this.cohortYear);
      });
    }
    getAcademicLabel(){
      console.log(this.academicLabelSelected);
      this.http.get(`http://localhost:8000/getAcademicLabel/`).subscribe(data =>{
        console.log(data);
        this.academicLabel = Object.values(data).map(a => a.academicLabel);
        console.log(this.academicLabel);
      });
    }
    getAcademicType(){
      console.log(this.cohortAcademicTypeSelected);
      this.http.get(`http://localhost:8000/getAcademicType/${this.studentTypeSelected}/${this.cohortYearSelected}/${this.academicLabelSelected}`).subscribe(data =>{
        console.log(data);
        this.cohortAcademicType = Object.values(data).map(a => a.academicType);
        console.log(this.cohortAcademicType);
      });
    }

}
