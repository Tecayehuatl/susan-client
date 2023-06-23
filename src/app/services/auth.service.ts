import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private userSubject!: BehaviorSubject<any>;
    user!: Observable<IUser>;
    localStorageKeyName = 'bioUser';

    get userValue(): IUser {
        return this.userSubject.value;
    }

    constructor(private http: HttpClient, private router: Router) {
        this.userSubject = new BehaviorSubject<any>(this.getItem());
        this.user = this.userSubject.asObservable();
    }

    getItem(): any {
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
                map(({ token }) => {
                    const user: IUser = {
                        token: token,
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

export interface IUser {
    token?: string;
}
