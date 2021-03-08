import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UserService, AuthenticationService } from '../_services';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent implements OnInit {
    currentUser: any;
    users = [];

    constructor(
        private authenticationService: AuthenticationService,
        private userService: UserService,
          private router: Router,
    ) {
      // this assigment reaches out to the authenticationService and retrieves the value of the current user
        this.currentUser = this.authenticationService.currentUserValue;

    }
    // after previously retrieving the value, if the value is accpedted (the person accessing the link is logged in)
    // the user will remain in the home page. If an unidentified user tries to access the link, it will be redirected to
    // the login page
    ngOnInit() {
      if (this.authenticationService.currentUserValue && this.authenticationService.isTokenValid()) {
          this.router.navigate(['/home']);
      }else{
          this.authenticationService.logout();
          this.router.navigate(['/']);
      }
    }

    // not used
    deleteUser(id: number) {
        this.userService.delete(id)
            .pipe(first())
            .subscribe(() => this.loadAllUsers());
    }

    // testing purposes
    getUsername (){
      console.log(this.currentUser.username);
    }
    //not used
    loadAllUsers() {
        this.userService.getAll()
            .pipe(first())
            .subscribe(users => this.users = users);
    }
}
