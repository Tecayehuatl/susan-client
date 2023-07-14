import { Injectable, inject } from '@angular/core';
import { Patient } from '../dashboard/patients/patients.component';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
    ActivatedRouteSnapshot,
    ResolveFn,
    RouterStateSnapshot,
} from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class PatientsService {
    constructor(private http: HttpClient) {}

    getPatients(): Observable<Patient[]> {
        return this.http.get<Patient[]>(`${environment.baseUrl}/patients`);
    }

    getPatient(id: string): Observable<Patient> {
        return this.http.get<Patient>(`${environment.baseUrl}/patients/${id}`);
    }

    createPatient(patient: Patient): Observable<Patient> {
        return this.http.post<Patient>(
            `${environment.baseUrl}/patients`,
            patient
        );
    }

    updatePatient(patient: Patient): Observable<Patient> {
        return this.http.put<Patient>(
            `${environment.baseUrl}/patients/${patient.patient_id}`,
            patient
        );
    }

    deletePatient(id: string) {
        return this.http.delete(`${environment.baseUrl}/patients/${id}`);
    }
}

export const getPatientDetailResolver: ResolveFn<any> = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
) => {
    const id = route.params['patientId'];
    return inject(PatientsService).getPatient(id);
};
