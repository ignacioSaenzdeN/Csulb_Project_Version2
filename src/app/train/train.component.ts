import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UploadService } from "../_services/upload.service";
import { TrainService } from "../_services/train.service";
//import * as moment from 'moment';

@Component({
  selector: "app-train",
  templateUrl: "./train.component.html",
  styleUrls: ["./train.component.less"],
})
export class TrainComponent implements OnInit {
  trainForm: FormGroup;
  formatedDate: string = "";

  constructor(
    private formBuilder: FormBuilder,
    private trainService: TrainService,
    private uploadService: UploadService
  ) {}

  ngOnInit() {
    this.trainService.getFilesNames();
    this.createForm();
    //this.formatFileDate();
  }

  private createForm() {
    this.trainForm = this.formBuilder.group({
      fileDropdown: ["", Validators.required],
      academicType: ["", Validators.required],
    });
  }

  // private formatFileDate(){
  //   this.formatedDate = moment(this.trainService.file.pubDate).format('MMMM Do YYYY, h:mm:ss a');
  // }

  onSubmit(){
    this.trainService.uploadCohort();
  }
}
