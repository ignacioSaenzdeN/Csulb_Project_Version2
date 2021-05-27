import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService, AlertService } from '../_services';
import { first } from 'rxjs/operators';

@Component({
  // selector: 'app-account-reset',
  templateUrl: './account-reset.component.html',
  styleUrls: ['./account-reset.component.less']
})
// 
export class AccountResetComponent implements OnInit {
  accountResetForm: FormGroup;
  submitted = false;
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.accountResetForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }
  // convenience getter for easy access to form fields
  get f() { return this.accountResetForm.controls; }

  onSubmit() {
    this.submitted = true;
    // reset alerts on submit
    this.alertService.clear();

    if (this.accountResetForm.invalid) {
      return;
    }
    this.loading = true;
    // TODO: Check why error messages are not working well
    this.userService.sendPasswordResetLink(this.accountResetForm.value).subscribe(
      data => {
        this.alertService.success("Email sent"), setTimeout(() => {
          this.router.navigate(['/login']);
        }, 500);
      },
      error => {
        this.alertService.success('Please enter the e-mail account associated to your account', false);
        this.loading = false;
      });
    this.loading = false;
  }

}
