import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Doctor } from '../dashboard/doctors/doctors.component';
import { Observable } from 'rxjs';
import {
    ActivatedRouteSnapshot,
    ResolveFn,
    RouterStateSnapshot,
} from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class DoctorsService {
    constructor(private http: HttpClient) {}

    getDoctors() {
        return this.http.get(`${environment.baseUrl}/doctors`);
    }

    createDoctor(doctor: Doctor): Observable<Doctor> {
        return this.http.post<Doctor>(`${environment.baseUrl}/doctors`, doctor);
    }

    updateDoctor(doctor: Doctor): Observable<Doctor> {
        return this.http.put<Doctor>(
            `${environment.baseUrl}/doctors/${doctor.doctor_id}`,
            doctor
        );
    }

    deleteDoctor(id: string) {
        return this.http.delete(`${environment.baseUrl}/doctors/${id}`);
    }
}

export const getDoctorsResolver: ResolveFn<any> = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
) => {
    return inject(DoctorsService).getDoctors();
};
