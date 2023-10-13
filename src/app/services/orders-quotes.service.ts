import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Study } from '../dashboard/studies/studies.component';
import { Discount } from './discounts.service';
import { Patient } from '../dashboard/patients/patients.component';
import { Doctor } from '../dashboard/doctors/doctors.component';
import { User } from '../dashboard/users/users.component';

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

    // TODO: Try with notes, payments to test different scenarios
    //  to replace the any type
    updateOrder(order: any, id: string): Observable<Order> {
        return this.http.patch<Order>(
            `${environment.baseUrl}/orders/${id}`,
            order
        );
    }

    deleteOrder(id: string) {
        return this.http.delete(`${environment.baseUrl}/orders/${id}`);
    }

    deletePaymentFromOrder(orderId: string, orderPaymentId: string) {
        return this.http.delete(
            `${environment.baseUrl}/orders/${orderId}/payments/${orderPaymentId}`
        );
    }

    deleteNoteFromOrder(orderId: string, noteId: string | number = '') {
        return this.http.delete(
            `${environment.baseUrl}/orders/${orderId}/notes/${noteId}`
        );
    }
}

export interface Order {
    order_id?: string;
    branch_office_id: number;
    created_at: string;
    order_type_id: number;
    delivery_days?: number;

    order_status_id?: number;
    payment_status_id?: number;
    delivery_status_id?: number;

    patient_id: number;
    doctor_id: number;
    balance?: number;
    studies: Study[];
    // payments and order_payments are duplicated, the services should unify those props
    payments: Payment[];
    order_payments?: Payment[];
    discounts: Discount[];
    order_notes?: OrderNote[];
    patient?: Patient;
    user?: User;
    doctor?: Doctor;
    order_studies?: Study[];
    order_discounts?: Discount[];
}

export interface OrderNote {
    order_note_id: number;
    note: string;
}

export interface Payment {
    payment_type_id: number;
    order_payment_id?: number;
    total_transaction: string;
    change_due: string | number;
    cash_received: string | number;
}
