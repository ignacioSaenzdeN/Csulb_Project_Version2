import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UploadService } from "../_services/upload.service";
import { TrainService } from "../_services/train.service";
import { Router,NavigationEnd   } from '@angular/router';
import { Cohort, File } from "../_models";


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
    private uploadService: UploadService,
    private router: Router,
  ) {
    //Resets file selection, cohort and train labels when user navigates to a different component
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        trainService.file = new File();
        trainService.cohort = new Cohort();
        trainService.showTrain = false;
      }
    });
  }

  ngOnInit() {
    this.trainService.getFilesNames();
    this.createForm();
  }

  private createForm() {
    this.trainForm = this.formBuilder.group({
      fileDropdown: ["", Validators.required],
      academicType: ["", Validators.required],
    });
  }
  onSubmit(){
    this.trainService.uploadCohort();
  }
}
