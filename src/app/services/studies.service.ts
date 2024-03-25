import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Study } from '../dashboard/studies/studies.component';
import {
    ActivatedRouteSnapshot,
    ResolveFn,
    RouterStateSnapshot,
} from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class StudiesService {
    constructor(private http: HttpClient) {}

    getStudies(): Observable<Study[]> {
        return this.http.get<Study[]>(`${environment.baseUrl}/studies`);
    }

    searchStudies(query: string): Observable<Study[]> {
        console.log('query', query);

        return this.http.get<Study[]>(`${environment.baseUrl}/studies/search`, {
            params: {
                q: query,
            },
        });
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

    deleteStudy(id: number) {
        return this.http.delete(`${environment.baseUrl}/studies/${id}`);
    }
}

export const getStudiesResolver: ResolveFn<any> = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
) => {
    return inject(StudiesService).getStudies();
};
