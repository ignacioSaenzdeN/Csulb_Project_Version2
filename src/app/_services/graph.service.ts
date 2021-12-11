import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { environment } from "@environments/environment";
import { Cohort } from "../_models";
import { Chart } from "chart.js";

@Injectable({ providedIn: "root" })
export class GraphService {
  public list_of_charts = [];
  public chart = Chart;
  description_temp = "";

  constructor(private http: HttpClient, private formBuilder: FormBuilder) {}

  ngOnInit() {}

  public displayGraph(data, isTraining) {
    // this.description_temp = [];
    for (i = 0; i < this.list_of_charts.length; i++) {
      this.list_of_charts[i].destroy();
    }
    var yLabel = "";
    this.list_of_charts = [];

    var x_axis = [];
    var dataset_list = [];
    //this for loop will get each of the graphs
    var charts, graphs, functions;
    //var colors=['red','blue','purple','yellow','black','brown','Crimson','Cyan','DarkOrchid'];
    var canvases = ['canvas', 'canvas1', 'canvas2', 'canvas3', 'canvas4', 'canvas5'];
    var iterator = 0;
    // the following strings need to match the values they have in the backend
    // to properly access the data.
    // the code below, starts decapsuling the data received from the backend
    // and stores the data from each layer in its corresponding variable.
    // The concept of the code below is similar to the russian dolls.
    // To better understand the structure of the data received, check \
    // the backend code
    var graphs_container = "Figures";
    var description = "default";
    var i = 1;
    for (let graphs in data[graphs_container]) {
      for (functions in data[graphs_container][graphs]) {
        if (functions == "x-axis") {
          x_axis = data[graphs_container][graphs][functions];
        } else if (functions == "description") {
          this.description_temp = (data[graphs_container][graphs][functions]);
          // +"\n"
        } else if (functions == 'yLabel') {
          yLabel = data[graphs_container][graphs][functions];
        }
        else {
          // console.log(data[graphs_container][graphs][functions]);
          if ((graphs == "figure4") && (data[graphs_container][graphs][functions].length > 2)) {
            let checkBool = (data[graphs_container][graphs][functions][2] === 'true')
            dataset_list.push(this.initializeDataset(functions, data[graphs_container][graphs][functions][0],
              data[graphs_container][graphs][functions][1], data[graphs_container][graphs][functions][1], checkBool));
          }
          else {
            dataset_list.push(this.initializeDataset(functions, data[graphs_container][graphs][functions][0],
              data[graphs_container][graphs][functions][1], data[graphs_container][graphs][functions][1], true));
          }
          iterator = iterator + 1;
        }
      }
      //this allocates the graphs into the canvases in the html
      var canvasNum = isTraining ? 4 : i;
      if (dataset_list.length > 0) {
        this.initializeGraph("canvas" + canvasNum, dataset_list, x_axis, yLabel, this.description_temp);
        var canvas = <HTMLCanvasElement>document.getElementById("canvas" + canvasNum);
        var context = canvas.getContext("2d");
        dataset_list = [];
        iterator = 0;
        i = i + 1;
      }
    }
  }

  private initializeDataset(
    _label,
    _data,
    _backgroundColor,
    _borderColor,
    _showLineBool
  ) {
    let shapeBackground = _showLineBool ? _backgroundColor : "#e9ecef";
    var ans = {
      label: _label,
      data: _data,
      backgroundColor: _backgroundColor,
      borderColor: _borderColor,
      fill: false,
      showLine: _showLineBool,
      pointStyle: "circle",
      pointBackgroundColor: shapeBackground,
    };
    return ans;
  }

  private initializeGraph(id, _datasets, _labels, yAxisLabel, title) {
    this.chart = new Chart(id, {
      type: "line",
      data: {
        // labels: [0.0, 1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0, 11.0, 12.0, 13.0, 14.0, 15.0],
        labels: _labels,
        datasets: _datasets,
      },
      options: {
        title: {
                  display: true,
                  text: title,
                  position: 'bottom'
                },
        scales: {
          yAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: yAxisLabel,
              },
            },
          ],
          xAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: "Time (Semesters)",
              },
            },
          ],
        },
      },
    });
    this.list_of_charts.push(this.chart);
  }
}
