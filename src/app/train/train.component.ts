import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UploadService } from "../_services/upload.service";
import { TrainService } from "../_services/train.service";

@Component({
  selector: "app-train",
  templateUrl: "./train.component.html",
  styleUrls: ["./train.component.less"],
})
export class TrainComponent implements OnInit {
  trainForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private trainService: TrainService,
    private uploadService: UploadService
  ) {}

  ngOnInit() {
    this.uploadService.getFilesNames();
    this.createForm();
  }

  private createForm() {
    this.trainForm = this.formBuilder.group({
      fileDropdown: ["", Validators.required],
      academicType: ["", Validators.required],
    });
  }
}
