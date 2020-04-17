import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { MustMatch } from '../_helpers/must-match.validator';

import { UserService, AuthenticationService, AlertService } from '../_services';

@Component({ templateUrl: 'register.component.html' })
export class RegisterComponent implements OnInit {
    registerForm: FormGroup;
    loading = false;
    submitted = false;

    //Unit and access Options (declared on init)
    unit_list:string[];
    access_list:string[];
    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private authenticationService: AuthenticationService,
        private userService: UserService,
        private alertService: AlertService
    ){

    }

    ngOnInit() {
        this.registerForm = this.formBuilder.group({
            // firstName: ['', Validators.required],
            // lastName: ['', Validators.required],
            username: ['', Validators.required],
            email: [ '', [Validators.required,Validators.email]],
            unit_level: ['', Validators.required],
            access: ['', Validators.required],
          //  authorization: ['', Validators.required],
        }
      );
        this.set_unit_and_access_options();
    }

    // convenience getter for easy access to form fields
    get f() { return this.registerForm.controls; }

    onSubmit() {
        console.log("controls");
        console.log (this.registerForm.controls);
        console.log (this.registerForm.controls.username.value);

        //perhaps, overwrite a formcontrol with the following so it is in the right format
        var access_lvl = this.registerForm.controls.unit_level.value +this.registerForm.controls.access.value;
        console.log(access_lvl);
        this.submitted = true;
        // reset alerts on submit
        this.alertService.clear();
        // stop here if form is invalid
        if (this.registerForm.invalid) {
            return;
        }
        this.loading = true;
        // this.userService.register(this.registerForm.value)
        //     .pipe(first())
        //     .subscribe(
        //         data => {this.alertService.success('Registration successful', true);},
        //         error => {this.alertService.success('Registration successful', true);
        //             this.loading = false;
        //         });
        this.loading = false;
    }
    private set_unit_and_access_options(){
        this.unit_list= ['','CECS','MAR','CE'];
        this.access_list=['','provider','consumer'];
        //.subscribe(data =>{console.log(data);})
    }
}
