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
      console.log("form for registering user:");
      console.log(form);
      return this.http.post(`http://localhost:8000/createUser/`, form);
    }

// this method determines the level of access of the new user upon its creation
    inviteuser(form){
      console.log("inviting user");
      // this.register(form);
      return this.http.post(`http://localhost:8000/permission/`, form);
    }

// the following method is used when uploading files to train the model
    upload(form){
      console.log("uploaded");
      return this.http.post(`http://localhost:8000/upload/`, form);
    }
// Not used
    delete(id) {
      return this.http.delete(`${environment.apiUrl}/users/${id}`);
    }

// Used to request password reset link
   sendPasswordResetLink(email){
     return this.http.post(`http://localhost:8000/account-reset-validate/`, email);
   }

// Used to verify token
   passwordResetVerifyToken(passwordResetToken){
     return this.http.post(`http://localhost:8000/account-reset-validate/verify-token/`, passwordResetToken);
   }
// Used to verify token and send new password 
  confirmPasswordReset(tokenPassword){
    return this.http.post(`http://localhost:8000/account-reset-validate/confirm/`, tokenPassword);
  }


}
