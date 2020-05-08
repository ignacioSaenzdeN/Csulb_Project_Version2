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
        this.currentUser = this.authenticationService.currentUserValue;

    }

    ngOnInit() {
      if (this.authenticationService.currentUserValue) {
          this.router.navigate(['/home']);
      }else{
          this.router.navigate(['/']);
      }
    }

    deleteUser(id: number) {
        this.userService.delete(id)
            .pipe(first())
            .subscribe(() => this.loadAllUsers());
    }
    getUsername (){
      console.log(this.currentUser.username);
    }
    loadAllUsers() {
        this.userService.getAll()
            .pipe(first())
            .subscribe(users => this.users = users);
    }
}
