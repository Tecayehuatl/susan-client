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
                    // TODO: Make sure to be receiving this values from the BE
                    const {
                        username: usernameMail,
                        userId,
                        firstName,
                        middleName,
                        lastName,
                        branchOfficeId,
                    } = jwt_decode(response.token) as UserSystem;

                    const user: UserSystem = {
                        token: response.token,
                        userId: userId || '',
                        username: usernameMail || '',
                        firstName: firstName || '',
                        middleName: middleName || '',
                        lastName: lastName || '',
                        branchOfficeId: branchOfficeId || '',
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
    userId: string;
    username: string;
    firstName: string;
    middleName: string;
    lastName: string;
    branchOfficeId: string;
}
