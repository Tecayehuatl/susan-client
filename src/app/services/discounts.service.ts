import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class DiscountsService {
    constructor(private http: HttpClient) {}

    getDiscounts(): Observable<Discount[]> {
        return this.http.get<Discount[]>(`${environment.baseUrl}/discounts`);
    }

    getDiscount(id: string): Observable<Discount> {
        return this.http.get<Discount>(
            `${environment.baseUrl}/discounts/${id}`
        );
    }

    createDiscount(discount: Discount): Observable<Discount> {
        return this.http.post<Discount>(
            `${environment.baseUrl}/discounts`,
            discount
        );
    }

    updateDiscount(discount: Discount): Observable<Discount> {
        return this.http.put<Discount>(
            `${environment.baseUrl}/discounts/${discount.discount_id}`,
            discount
        );
    }

    deleteDiscount(id: number) {
        return this.http.delete(`${environment.baseUrl}/discounts/${id}`);
    }
}

export interface Discount {
    discount_id: number;
    name: string;
    discountPercentage: number;
    isActive: boolean;
}
