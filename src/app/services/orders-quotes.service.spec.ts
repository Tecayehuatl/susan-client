import { TestBed } from '@angular/core/testing';

import { OrdersQuotesService } from './orders-quotes.service';

describe('OrdersQuotesService', () => {
    let service: OrdersQuotesService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(OrdersQuotesService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
