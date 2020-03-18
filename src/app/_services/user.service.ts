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

    register(user:User) {
        return this.http.post(`http://localhost:8000/createUser`, user);
    }

    delete(id) {
        return this.http.delete(`${environment.apiUrl}/users/${id}`);
    }
    getGraph(){
        this.http.get(`http://localhost:8000/markov/900/`).subscribe (data =>{console.log(data);});
    }
}
