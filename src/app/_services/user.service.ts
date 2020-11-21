import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';

import { User } from '../_models';
@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private http: HttpClient) { }


//Not use and not implemented
    getAll() {
        return this.http.get<any[]>(`http://localhost:8000/users`);
    }
// Used to invite users into the system
    register(form) {
      console.log("form");
      console.log(form);
      return this.http.post(`http://localhost:8000/createUser/`, form);
    }
// Not used
    delete(id) {
        return this.http.delete(`${environment.apiUrl}/users/${id}`);
    }
// this method determines the level of access of the new user upon its creation
    inviteuser(form){
      console.log("inviting user");
      this.register(form);
      return this.http.post(`http://localhost:8000/permission/`, form);
    }

// the following method is used when uploading files to the backend
    upload(form){
      console.log("uploaded");
      return this.http.post(`http://localhost:8000/upload/`, form);
    }

}
