import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '@environments/environment';
import { Cohort } from '../_models';
import { Chart } from 'chart.js';


@Injectable({providedIn: 'root'})
export class GraphService {
    public list_of_charts = [];
    public chart = Chart;

    constructor( private http: HttpClient, private formBuilder: FormBuilder,) {
    }

    ngOnInit(){
    }

    public displayGraph(data) {
        let description_temp = "";
        for (let i = 0; i < this.list_of_charts.length; i++) {
          this.list_of_charts[i].destroy();
        }
        var yLabel = "";
        this.list_of_charts = [];
    
        var x_axis = [];
        var dataset_list = [];
        //this for loop will get each of the graphs
        var functions;
        var iterator = 0;
        // the following strings need to match the values they have in the backend
        // to properly access the data.
        // the code below, starts decapsuling the data received from the backend
        // and stores the data from each layer in its corresponding variable.
        // The concept of the code below is similar to the russian dolls.
        // To better understand the structure of the data received, check \
        // the backend code
        var i = 1;
        for (let graphs in data) {
          if (graphs == "figure4") {
            for (functions in data[graphs]) {
              if (functions == "x-axis") {
                x_axis = data[graphs][functions];
              } else if (functions == "description") {
                description_temp += data[graphs][functions] + "\n";
              } else if (functions == 'yLabel') {
                yLabel = data[graphs][functions];
              }
              else {
                if ((graphs == "figure4") && (data[graphs][functions].length > 2)) {
                  let checkBool = (data[graphs][functions][2] === 'true')
                  dataset_list.push(this.initializeDataset(functions, data[graphs][functions][0],
                    data[graphs][functions][1], data[graphs][functions][1], checkBool));
                }
                else {
                  dataset_list.push(this.initializeDataset(functions, data[graphs][functions][0],
                    data[graphs][functions][1], data[graphs][functions][1], true));
                }
                iterator = iterator + 1;
              }
            }
            //this allocates the graphs into the canvases in the html
            if (dataset_list.length > 0) {
              this.initializeGraph("canvas" + i, dataset_list, x_axis, yLabel);
              var canvas = <HTMLCanvasElement>document.getElementById("canvas" + (i));
              var context = canvas.getContext("2d");
              dataset_list = [];
              iterator = 0;
              i = i + 1;
            }
          }
        }
      }

      private initializeDataset(_label, _data, _backgroundColor, _borderColor, _showLineBool) {
        let shapeBackground = _showLineBool ? _backgroundColor : "#e9ecef";
        var ans = { "label": _label, "data": _data, "backgroundColor": _backgroundColor, "borderColor": _borderColor, "fill": false, "showLine": _showLineBool, "pointStyle": "circle", "pointBackgroundColor": shapeBackground };
        return ans;
      }

      private initializeGraph(id, _datasets, _labels, yAxisLabel) {
        this.chart = new Chart(id, {
          type: 'line',
          data: {
            // labels: [0.0, 1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0, 11.0, 12.0, 13.0, 14.0, 15.0],
            labels: _labels,
            datasets: _datasets,
          },
          options: {
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

      
    
}