import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';

import { User } from '../_models';
@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<any[]>(`http://localhost:8000/users`);
    }

    register(form) {
      console.log("form");
      console.log(form);
      return this.http.post(`http://localhost:8000/createUser/`, form);
    }

    delete(id) {
        return this.http.delete(`${environment.apiUrl}/users/${id}`);
    }
    inviteuser(form){
      console.log("inviting user");
      this.register(form);
      return this.http.post(`http://localhost:8000/permission/`, form);
    }
    upload(form){
      console.log("uploaded");
      return this.http.post(`http://localhost:8000/upload/`, form);
    }

}
