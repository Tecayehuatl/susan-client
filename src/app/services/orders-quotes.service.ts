import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Study } from '../dashboard/studies/studies.component';
import { Discount } from './discounts.service';
import { Patient } from '../dashboard/patients/patients.component';
import { Doctor } from '../dashboard/doctors/doctors.component';

@Injectable({
    providedIn: 'root',
})
export class OrdersQuotesService {
    constructor(private http: HttpClient) {}

    getOrders(): Observable<Order[]> {
        return this.http.get<Order[]>(`${environment.baseUrl}/orders`);
    }

    createOrder(order: Order): Observable<Order> {
        return this.http.post<Order>(`${environment.baseUrl}/orders`, order);
    }

    updateOrder(order: Order): Observable<Order> {
        return this.http.put<Order>(
            `${environment.baseUrl}/orders/${order.order_type_id}`,
            order
        );
    }

    deleteOrder(id: string) {
        return this.http.delete(`${environment.baseUrl}/orders/${id}`);
    }
}

export interface Order {
    branch_office_id: number;
    created_at: string;
    order_type_id: number;
    order_status_id: number;
    payment_status_id: number;
    delivery_status_id: number;
    patient_id: number;
    doctor_id: number;
    studies: Study[];
    payments: any[];
    discounts: Discount[];
    order_notes?: OrderNote[];
    patient?: Patient;
    doctor?: Doctor;
    order_studies?: Study[];
}

export interface OrderNote {
    note: string;
}
