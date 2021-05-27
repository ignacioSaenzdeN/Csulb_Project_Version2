import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginComponent } from './login';
import { AuthenticationService } from './_services';
import { User } from './_models';

@Component({
  selector: 'app',
  template: `
    <ng-progress id="myProgress"></ng-progress>
  `,
  styleUrls: ['./app.component.less'],
  templateUrl: 'app.component.html'
})
export class AppComponent {
  currentUser: User;
  isProvider: boolean;
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    // the following lines help setting the currentUser object as well as
    // the user's permissions
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    this.authenticationService.isProviderObservable.subscribe(data => this.isProvider = data);
  }

  //botton that when pressed on the application, logs the user out and redirects the app to the login website
  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }
}
