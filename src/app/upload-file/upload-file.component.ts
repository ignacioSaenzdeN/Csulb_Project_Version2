import { Component, OnInit, Input } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UserService, AuthenticationService, AlertService } from "../_services";
import { Router, ActivatedRoute } from "@angular/router";
import { UploadService } from "../_services/upload.service";
import { TrainService } from "../_services/train.service";

@Component({
  selector: "app-upload-file",
  templateUrl: "./upload-file.component.html",
  styleUrls: ["./upload-file.component.css"],
})
export class UploadFileComponent {
  // variables related to the form and the files uploaded to the form
  uploadForm: FormGroup;
  //variables related to submission of form
  loading = false;
  //this boolean switches from the uploading form to the training section once the form is submitted
  uploadBoolean = true;
  trainBoolean = false;
  // bool that activates once the user confirms training
  accepted_bool = false;
  uniqueID: any;

  constructor(
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private router: Router,
    private userService: UserService,
    private uploadService: UploadService,
    private trainService: TrainService
  ) {}
  ngOnInit() {
    // if user is not validated, the user will be redirected to the login
    if (
      this.authenticationService.currentUserValue &&
      this.authenticationService.isTokenValid()
    ) {
      this.router.navigate(["/uploadView"]);
    } else {
      this.authenticationService.logout();
      this.router.navigate(["/"]);
    }
    this.createForm();
  }

  private createForm() {
    this.uploadForm = this.formBuilder.group({
      fileDropdown: ["", Validators.required],
      academicType: ["", Validators.required],
      //these might need to be deleted later
      academicTypeF: ["", Validators.required],
      amountOfStudents: ["", [Validators.required]],
      academicLabel: ["", [Validators.required]],
      data: ["", [Validators.required]],
    });
  }
  // f() is just a shortcut to access the controls
  get f() {
    return this.uploadForm.controls;
  }

  // for the form submission
  onSubmit() {
    if (this.uploadForm.invalid) {
      return;
    }
    this.loading = true;

    //this sends the form to the backend, in the front end we get the ID of the submission
    // used to identify the higherEdDatabase Object
    this.userService.upload(this.uploadForm.value).subscribe(
      (data) => {
        this.uniqueID = data;
        this.trainService.train();
      },
      (error) => {
        console.log("in error");
        this.loading = false;
      }
    );

    this.loading = false;
  }
}
