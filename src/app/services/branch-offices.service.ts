import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class BranchOfficesService {
    constructor(private http: HttpClient) {}

    getBranchOffices() {
        return this.http.get(`${environment.baseUrl}/branch-offices`);
    }
}
