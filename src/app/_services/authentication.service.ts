import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {User} from '../_models';
import { environment } from '@environments/environment';
import { of as observableOf } from 'rxjs';
import * as jwt_decode from 'jwt-decode';

// The code below is used for authentication purposes as well as determining
// level of access between users
@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;
    public permissions=[];
    public isProvider:boolean;
    public isProviderObservable: Observable<boolean>;
    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
        this.isProviderObservable = observableOf( this.isProvider);
        this.getperm();
    }

    public get currentUserValue() {
        return this.currentUserSubject.value;
    }
    login(username, password) {
        this.getpermission(username,password);
        return this.http.post<any>(`http://localhost:8000/api/token`, { username, password })
            .pipe(map(user => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('currentUser', JSON.stringify(user));
                this.currentUserSubject.next(user);
                console.log(user);
                let temp = jwt_decode(user.access);
                console.log(temp);
                return user;
            }));
    }
    isTokenValid(){
      let currentTimeInSeconds=Math.floor(Date.now()/1000);
      let token = JSON.parse( localStorage.getItem('currentUser') );
      let accessToken =jwt_decode(token.access);
      let expirationDate = accessToken.exp;
      return expirationDate> currentTimeInSeconds;
    }
    refresh(){
      this.isTokenValid();
      let token = JSON.parse( localStorage.getItem('currentUser') );
      console.log("auth refresh");
      console.log(jwt_decode(token.refresh));
    }
    // The following example retrieves the level of access of an indivual.
    // The reques returns the access the user has to each level
    getpermission(username,password){
      this.permissions=[];
      this.isProvider=false;
        this.http.post<any>('http://localhost:8000/getpermission/',{'username':username,'password':password}).subscribe(data =>{
          console.log("hello");
          for (let perm in data){
            this.permissions.push(data[perm]);
          }
          // At the moment, the permissions are stored next to the token
          localStorage.setItem('curr_permissions',JSON.stringify(this.permissions));

          // As currently, there is no way to retrieve the level of access,
          // this function will check if the word provider is in any of the
          // permissions received.
          var temp = JSON.parse( localStorage.getItem('curr_permissions') );
          var entire_perm=temp[0];
          // With the current system, "provide" always remains in the same
          //  position of the string, so this is the current system used to
          // retrieve the level of access
          var permission = entire_perm.substring(entire_perm.length-8, entire_perm.length);
          if (permission=="provider"){
            this.isProvider=true;
            // return true;
          }else{
            this.isProvider=false;
            // return false;
          }

          // console.log(JSON.parse( localStorage.getItem('curr_permissions[0]') ));
        });
    }
    // This function does the same as the previous one but it retrieves the data
    // that is currently locally stored.
    getperm(){
      var temp = JSON.parse( localStorage.getItem('curr_permissions') );
      if (temp==null){
        return;
      }

      var entire_perm=temp[0];
      var permission = entire_perm.substring(entire_perm.length-8, entire_perm.length);
      if (permission=="provider"){
        this.isProvider=true;
        // return true;
      }else{
        this.isProvider=false;
        // return false;
      }
    }
    logout() {
        // remove user from local storage and set current user to null
        localStorage.removeItem('currentUser');
        localStorage.removeItem('curr_permissions');
        this.currentUserSubject.next(null);
    }
}
