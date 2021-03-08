import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService, AlertService} from '../../_services';
import { Router, ActivatedRoute } from '@angular/router';
import { MustMatch } from '../../_helpers/must-match.validator';

@Component({
  //selector: 'app-account-reset-validate',
  templateUrl: './account-reset-validate.component.html',
  styleUrls: ['./account-reset-validate.component.less']
})
export class AccountResetValidateComponent implements OnInit {
  accountValidateForm: FormGroup;
  submitted = false;
  loading = false;
  aToken: string;
  tempJson = {'token': '' };
  tokenPass = {"password": "", "token": ""};
  constructor( 
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private alertService: AlertService
    ) { }

  ngOnInit() {
    this.accountValidateForm = this.formBuilder.group({
      password: ['', Validators.required],
      passwordConfirm: ['', Validators.required]
    }, {
      validator: MustMatch('password', 'passwordConfirm')
  });
    this.aToken = this.activatedRoute.snapshot.queryParamMap.get('token');
    this.tempJson.token = this.aToken;
    this.userService.passwordResetVerifyToken(this.tempJson)
    .subscribe(
      data=> {},
      error => {this.router.navigate(['/account-reset']), this.alertService.success("The reset password link has expired or is invalid, please request a new one", true);}
      );
  }
  // convenience getter for easy access to form fields
  get f() { return this.accountValidateForm.controls; }

  

  onSubmit(){
    this.submitted = true;
    this.tokenPass.token = this.aToken;
    this.tokenPass.password = this.accountValidateForm.controls.password.value;
    //reset alerts on submit
    this.alertService.clear();
    // stop here if form is invalid
    if (this.accountValidateForm.invalid) {
        return;
    }
    this.loading = true;    
    
    this.userService.confirmPasswordReset(this.tokenPass)
    .subscribe(
      data=> {this.alertService.success("Password has been succesfully changed"), setTimeout(() => {
        this.router.navigate(['/login']);
     }, 500);},
      error => {this.alertService.success("This password is too short or insecure");}
      );
      this.loading = false;
  }
  

}
