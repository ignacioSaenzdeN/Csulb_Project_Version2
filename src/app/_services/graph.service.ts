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

  public displayGraph(data, isTraining, isSnapshot) {
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
    var canvases = [
      "canvas",
      "canvas1",
      "canvas2",
      "canvas3",
      "canvas4",
      "canvas5",
    ];
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
          this.description_temp = data[graphs_container][graphs][functions];
        } else if (functions == "yLabel") {
          yLabel = data[graphs_container][graphs][functions];
        } else {
          if (
            graphs == "figure4" &&
            data[graphs_container][graphs][functions].length > 2
          ) {
            let checkBool =
              data[graphs_container][graphs][functions][2] === "true";
            let data_ = data[graphs_container][graphs][functions][0];
            dataset_list.push(
              this.initializeDataset(
                functions,
                data_,
                data[graphs_container][graphs][functions][1],
                data[graphs_container][graphs][functions][1],
                checkBool,
                false
              )
            );
          } else {
            if (isSnapshot) {
              let data_ = data[graphs_container][graphs][functions][0];
              let data_cpy = JSON.parse(JSON.stringify(data_));
              data_cpy.length = data_.length - 4;
              dataset_list.push(
                this.initializeDataset(
                  functions,
                  data_cpy,
                  data[graphs_container][graphs][functions][1],
                  data[graphs_container][graphs][functions][1],
                  true,
                  false
                )
              );

              let label = functions + "_";
              dataset_list.push(
                this.initializeDataset(
                  label,
                  data_,
                  data[graphs_container][graphs][functions][1],
                  data[graphs_container][graphs][functions][1],
                  true,
                  true
                )
              );
            } else {
              let data_ = data[graphs_container][graphs][functions][0];
              dataset_list.push(
                this.initializeDataset(
                  functions,
                  data_,
                  data[graphs_container][graphs][functions][1],
                  data[graphs_container][graphs][functions][1],
                  true,
                  false
                )
              );
            }
          }
          iterator = iterator + 1;
        }
      }
      //this allocates the graphs into the canvases in the html
      var canvasNum = isTraining ? 4 : i;
      if (dataset_list.length > 0) {
        this.initializeGraph(
          "canvas" + canvasNum,
          dataset_list,
          x_axis,
          yLabel,
          this.description_temp,
          isSnapshot
        );
        var canvas = <HTMLCanvasElement>(
          document.getElementById("canvas" + canvasNum)
        );
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
    _showLineBool,
    _showBorderDash
  ) {
    let shapeBackground = _showLineBool ? _backgroundColor : "#e9ecef";
    let borderDash = _showBorderDash ? [5, 1] : [];
    var ans = {
      label: _label,
      data: _data,
      backgroundColor: _backgroundColor,
      borderColor: _borderColor,
      fill: false,
      showLine: _showLineBool,
      pointStyle: "circle",
      pointBackgroundColor: shapeBackground,
      borderDash: borderDash,
    };
    return ans;
  }

  private initializeGraph(
    id,
    _datasets,
    _labels,
    yAxisLabel,
    title,
    isSnapshot
  ) {
    let chartOptions = {
      legend: {
        labels: {
          filter: function (label) {
            return !label.text.includes("_");
          },
        },
        onClick: function (e, legendItem) {
          // need to hide index -1 and index +1
          var index = legendItem.datasetIndex;
          var ci = this.chart;
          var alreadyHidden =
            ci.getDatasetMeta(index).hidden === null
              ? false
              : ci.getDatasetMeta(index).hidden;
          console.log("before meta_hi");
          if (isSnapshot) {
            var meta_hi = ci.getDatasetMeta(index + 1);
          }
          console.log("meta_hi", meta_hi);
          var meta = ci.getDatasetMeta(index);
          if (!alreadyHidden) {
            if (isSnapshot) {
              meta_hi.hidden = true;
            }
            meta.hidden = true;
          } else {
            if (isSnapshot) {
              meta_hi.hidden = null;
            }
            meta.hidden = null;
          }

          ci.update();
        },
      },

      title: {
        display: true,
        text: title,
        position: "bottom",
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
    };
    this.chart = new Chart(id, {
      type: "line",
      data: {
        labels: _labels,
        datasets: _datasets,
      },
      options: chartOptions,
    });
    this.list_of_charts.push(this.chart);
  }
}
