import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BranchOffice } from '../dashboard/branch-offices/branch-offices.component';
import { Observable } from 'rxjs';
import {
    ActivatedRouteSnapshot,
    ResolveFn,
    RouterStateSnapshot,
} from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class BranchOfficesService {
    constructor(private http: HttpClient) {}

    getBranchOffices() {
        return this.http.get(`${environment.baseUrl}/branch-offices`);
    }

    createBranchOffice(branchOffice: BranchOffice): Observable<BranchOffice> {
        return this.http.post<BranchOffice>(
            `${environment.baseUrl}/branch-offices`,
            branchOffice
        );
    }

    updateBranchOffice(branchOffice: BranchOffice): Observable<BranchOffice> {
        return this.http.put<BranchOffice>(
            `${environment.baseUrl}/branch-offices/${branchOffice.branch_office_id}`,
            branchOffice
        );
    }

    deleteBranchOffice(id: string) {
        return this.http.delete(`${environment.baseUrl}/branch-offices/${id}`);
    }
}

export const getBranchOfficesResolver: ResolveFn<any> = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
) => {
    return inject(BranchOfficesService).getBranchOffices();
};
