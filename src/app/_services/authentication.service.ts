import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {User} from '../_models';
import { environment } from '@environments/environment';
import { of as observableOf } from 'rxjs';

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
                return user;
            }));
    }
    getpermission(username,password){
      this.permissions=[];
      this.isProvider=false;
        this.http.post<any>('http://localhost:8000/getpermission/',{'username':username,'password':password}).subscribe(data =>{
          for (let perm in data){
            this.permissions.push(data[perm]);
          }
          localStorage.setItem('curr_permissions',JSON.stringify(this.permissions));


          var temp = JSON.parse( localStorage.getItem('curr_permissions') );
          var entire_perm=temp[0];
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
