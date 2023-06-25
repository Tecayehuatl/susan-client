import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

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
            `${environment.baseUrl}/orders/${order.orderId}`,
            order
        );
    }

    deleteOrder(id: string) {
        return this.http.delete(`${environment.baseUrl}/orders/${id}`);
    }
}

interface Order {
    orderId: string;
}
