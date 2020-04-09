import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../_services';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.less']
})
export class ProfileComponent implements OnInit {
  constructor(private authenticationService: AuthenticationService) { }

  ngOnInit() {
  }

}
