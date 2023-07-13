import { Injectable, inject } from '@angular/core';
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
export class PaymentMethodsService {
    constructor(private http: HttpClient) {}

    getPayments(): Observable<PaymentMethod[]> {
        return this.http.get<PaymentMethod[]>(
            `${environment.baseUrl}/payments`
        );
    }

    getPayment(id: string): Observable<PaymentMethod> {
        return this.http.get<PaymentMethod>(
            `${environment.baseUrl}/payments/${id}`
        );
    }

    createPayment(payment: PaymentMethod): Observable<PaymentMethod> {
        return this.http.post<PaymentMethod>(
            `${environment.baseUrl}/payments`,
            payment
        );
    }

    updatePayment(payment: PaymentMethod): Observable<PaymentMethod> {
        return this.http.put<PaymentMethod>(
            `${environment.baseUrl}/payments/${payment.payment_id}`,
            payment
        );
    }

    deletePatient(id: string) {
        return this.http.delete(`${environment.baseUrl}/payments/${id}`);
    }
}

export const getPaymentMethodsResolver: ResolveFn<any> = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
) => {
    return inject(PaymentMethodsService).getPayments();
};

export interface PaymentMethod {
    payment_id: number;
    name: string;
}
