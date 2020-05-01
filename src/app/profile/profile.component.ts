import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../_services';
import * as jwt_decode from 'jwt-decode';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.less']
})
export class ProfileComponent implements OnInit {
  constructor(private authenticationService: AuthenticationService,private http: HttpClient ) { }
  public username;
  ngOnInit() {
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

}
