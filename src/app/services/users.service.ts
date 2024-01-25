import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { User } from '../dashboard/users/users.component';

@Injectable({
    providedIn: 'root',
})
export class UsersService {
    constructor(private http: HttpClient) {}

    getUsers(): Observable<User[]> {
        return this.http.get<User[]>(`${environment.baseUrl}/users`);
    }

    createUser(user: User): Observable<User> {
        return this.http.post<User>(`${environment.baseUrl}/users`, user);
    }

    updateUser(user: User): Observable<User> {
        return this.http.put<User>(
            `${environment.baseUrl}/users/${user.user_id}`,
            user
        );
    }

    deleteUser(id: string) {
        return this.http.delete(`${environment.baseUrl}/users/${id}`);
    }
}
