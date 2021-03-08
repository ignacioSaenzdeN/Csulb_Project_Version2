import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../_services';
import * as jwt_decode from 'jwt-decode';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.less']
})
export class ProfileComponent implements OnInit {
  constructor(
    private authenticationService: AuthenticationService,
    private http: HttpClient,
    private router:Router,
    private formBuilder: FormBuilder,
   ) { }
  usernameChangeForm: FormGroup;
  passwordChangeForm: FormGroup;
  submitted= false;
  public username;
  public permission;
  public change_username= false;
  public change_password= false;
  private not_match_bool=false;
  private not_match_pass_bool=false;
  ngOnInit() {
    if (this.authenticationService.currentUserValue) {
        this.router.navigate(['/profile']);
    }else{
        this.router.navigate(['/']);
    }
    if (this.authenticationService.isProvider)
      this.permission="provider";
    else
      this.permission="consumer"
      // the following 3 lines retrieve the username from the jwt that will be displayed
      // in the html
      var user_json = JSON.parse( localStorage.getItem('currentUser') );
      // var decoded = jwt_decode(user_json.access);
      // this.username = decoded.username;
  }
  private getPerm(){
      this.http.get(`http://localhost:8000/permission/`).subscribe(data =>{console.log(data);});
      //.subscribe(data =>{console.log(data);})
  }

  get f() { return this.usernameChangeForm.controls; }
  get f_pass() { return this.passwordChangeForm.controls; }
  private changeUsername(){
    if (this.change_username==false){
    this.change_username= true;
    this.usernameChangeForm = this.formBuilder.group({
        // firstName: ['', Validators.required],
        // lastName: ['', Validators.required],
        username: ['', Validators.required],
        username_confirmation: ['', Validators.required],
      //  authorization: ['', Validators.required],
    }
  );
}else{
  this.change_username=false;
}
  }
  private  match(){
    return this.f.username.value== this.f.username_confirmation.value;
  }
  private match_password(){
    return this.f_pass.password.value== this.f_pass.password_confirmation.value;
  }
  private changePassword(){
    if (this.change_password==false){
    this.change_password= true;
    this.passwordChangeForm = this.formBuilder.group({
        password: ['', Validators.required],
        password_confirmation: ['', Validators.required],
    }
  );
}else{
  this.change_password=false;
}
  }
  onSubmitUsernameChange(){
    this.not_match_bool=false;
    this.submitted = true;
    if (!this.match()){
      this.not_match_bool=true;
      return;
    }
    if (this.usernameChangeForm.invalid) {return;}
    console.log("submitted");
    this.change_username=false;
    this.submitted = false;
    // make post request
  }
  onSubmitPasswordChange(){
    this.not_match_pass_bool=false;
    this.submitted = true;
    if (!this.match_password()){
      this.not_match_pass_bool=true;
      return;
    }
    if (this.passwordChangeForm.invalid) {
        return;
    }
    console.log("submitted");

    this.change_password=false;
      this.submitted = false;
    // make post request

  }
}
