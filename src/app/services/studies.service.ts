import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Study } from '../dashboard/studies/studies.component';

@Injectable({
    providedIn: 'root',
})
export class StudiesService {
    constructor(private http: HttpClient) {}

    getStudies() {
        return this.http.get(`${environment.baseUrl}/studies`);
    }

    createStudy(study: Study): Observable<Study> {
        return this.http.post<Study>(`${environment.baseUrl}/studies`, study);
    }

    updateStudy(study: Study): Observable<Study> {
        return this.http.put<Study>(
            `${environment.baseUrl}/studies/${study.study_id}`,
            study
        );
    }

    deleteStudy(id: string) {
        return this.http.delete(`${environment.baseUrl}/studies/${id}`);
    }
}
