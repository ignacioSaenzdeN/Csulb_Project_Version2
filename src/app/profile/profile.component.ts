import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../_services';
import * as jwt_decode from 'jwt-decode';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.less']
})
export class ProfileComponent implements OnInit {
  constructor(private authenticationService: AuthenticationService,
    private http: HttpClient,
    private router:Router,
   ) { }
  public username;
  public permission;
  public change_username= false;
  public change_password= false;
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
      var decoded = jwt_decode(user_json.access);
      this.username = decoded.username;
  }
  private getPerm(){
      this.http.get(`http://localhost:8000/permission/`).subscribe(data =>{console.log(data);});
      //.subscribe(data =>{console.log(data);})
  }
  private changeUsername(){
    this.change_username= true;
  }
  private changPassword(){
    this.change_username= true;
  }

}
