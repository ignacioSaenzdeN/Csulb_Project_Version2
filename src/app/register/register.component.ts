import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { MustMatch } from '../_helpers/must-match.validator';
import { UserService, AuthenticationService, AlertService } from '../_services';

@Component({ templateUrl: 'register.component.html',
styleUrls: ['./register.component.less'] })
export class RegisterComponent implements OnInit {
    registerForm: FormGroup;
    loading = false;
    submitted = false;
    fooform:FormGroup;
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
      if (this.authenticationService.currentUserValue&& this.authenticationService.isProvider) {
          this.router.navigate(['/register']);
      }else{
          this.router.navigate(['/']);
      }
        this.registerForm = this.formBuilder.group({
            // firstName: ['', Validators.required],
            // lastName: ['', Validators.required],
            username: ['', Validators.required],
            password: ['', Validators.required],
            email: [ '', [Validators.required,Validators.email]],
            unit_level: ['', Validators.required],
            access: ['', Validators.required],
          //  authorization: ['', Validators.required],
        }
      );
      this.fooform = this.formBuilder.group({
          // firstName: ['', Validators.required],
          // lastName: ['', Validators.required],
          username: ['', Validators.required],
          email: [ '', [Validators.required,Validators.email]],
          password: ['', Validators.required],
        //  authorization: ['', Validators.required],
      }
    );
        this.set_unit_and_access_options();
    }

    // convenience getter for easy access to form fields
    get f() { return this.registerForm.controls; }

    onSubmit() {
        // console.log("controls");
        // console.log (this.registerForm.controls);
        // console.log (this.registerForm.controls.username.value);
        // console.log(  this.registerForm.controls.unit_level);
        //perhaps, overwrite a formcontrol with the following so it is in the right format
        var access_lvl = this.registerForm.controls.unit_level.value +this.registerForm.controls.access.value;
        this.registerForm.controls.unit_level.setValue(access_lvl);
        // console.log("access_lvl");
        // console.log(access_lvl);
        // console.log("in the form");
        // console.log(  this.registerForm.controls.unit_level);
        this.submitted = true;
        // reset alerts on submit
        this.alertService.clear();
        // stop here if form is invalid
        console.log("asdads");
        if (this.registerForm.invalid) {
            return;
        }
        // if (this.fooform.invalid) {
        //     return;
        // }
        console.log("it will be sent");
        this.loading = true;
        this.userService.inviteuser(this.registerForm.value)
            .pipe(first())
            .subscribe(
                data => {this.alertService.success('Registration successful', true);},
                error => {this.alertService.success('Registration successful', true);
                    this.loading = false;
                });
        console.log("it has been sent");
        this.loading = false;
    }
    private set_unit_and_access_options(){
        this.unit_list= ['','Department','College','University'];
        this.access_list=['','Provider','Consumer'];
        //.subscribe(data =>{console.log(data);})
    }
    public createDefaultUser(){
      this.fooform.controls.username.setValue("userConsumer5");
      this.fooform.controls.password.setValue("123456");
      this.fooform.controls.email.setValue("a@gmail.com");

      this.userService.register(this.fooform.value);
    }
}
