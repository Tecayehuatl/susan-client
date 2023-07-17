import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private userSubject!: BehaviorSubject<any>;
    userSystem!: Observable<UserSystem>;
    localStorageKeyName = 'bioUser';

    get userSystemData(): UserSystem {
        return this.userSubject.value;
    }

    constructor(private http: HttpClient, private router: Router) {
        this.userSubject = new BehaviorSubject<any>(this.getItem());
        this.userSystem = this.userSubject.asObservable();
    }

    getItem(): string {
        const localStorageValue = localStorage.getItem(
            this.localStorageKeyName
        );

        if (localStorageValue) {
            return JSON.parse(localStorageValue);
        } else {
            return '';
        }
    }

    login(email: string, password: string) {
        return this.http
            .post<any>(`${environment.baseUrl}/auth`, {
                email,
                password,
            })
            .pipe(
                map((response) => {
                    const {
                        email: email,
                        user_id,
                        first_name,
                        middle_name,
                        last_name,
                        branch_office_id,
                    } = jwt_decode(response.token) as UserSystem;

                    const user: UserSystem = {
                        token: response.token,
                        user_id: user_id || '',
                        email: email || '',
                        first_name: first_name || '',
                        middle_name: middle_name || '',
                        last_name: last_name || '',
                        branch_office_id: branch_office_id || '',
                    };

                    localStorage.setItem(
                        this.localStorageKeyName,
                        JSON.stringify(user)
                    );
                    this.userSubject.next(user);
                    return user;
                })
            );
    }

    logout() {
        localStorage.removeItem(this.localStorageKeyName);
        this.userSubject.next({});
        this.router.navigate(['/login']);
    }
}

export interface UserSystem {
    token?: string;
    user_id: string;
    email: string;
    first_name: string;
    middle_name: string;
    last_name: string;
    branch_office_id: string;
}
