import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
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

export const getDiscountslResolver: ResolveFn<Discount[]> = () => {
    return inject(DiscountsService).getDiscounts();
};

export interface Discount {
    discount_id: number;
    name: string;
    discountPercentage: number;
    isActive: boolean;
}
