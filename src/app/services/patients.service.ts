import { Injectable } from '@angular/core';
import { Patient } from '../dashboard/patients/patients.component';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class PatientsService {
    constructor(private http: HttpClient) {}

    getPatients(): Observable<Patient[]> {
        return this.http.get<Patient[]>(`${environment.baseUrl}/patients`);
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
