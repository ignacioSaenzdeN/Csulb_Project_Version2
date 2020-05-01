import { Component } from '@angular/core';
import { Router } from '@angular/router';
import  {LoginComponent}from './login';
// import { jwt_decode  } from 'jwt-decode';
import { AuthenticationService } from './_services';
import { User } from './_models';
@Component({ selector: 'app',
styleUrls: ['./app.component.less'],
templateUrl: 'app.component.html' })
export class AppComponent {
    currentUser: User;
    // user subscr to db
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) {

        // var user_json = JSON.parse( localStorage.getItem('currentUser') );
        // var decoded = jwt_decode(user_json.access);
        this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    }
    //botton that when pressed on the application, logs the user out and redirects the app to the login website
    logout() {
        this.authenticationService.logout();
        this.router.navigate(['/login']);
    }
}
