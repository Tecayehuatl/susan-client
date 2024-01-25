import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentHistoricalTransactionsComponent } from './payment-historical-transactions.component';

describe('PaymentHistoricalTransactionsComponent', () => {
    let component: PaymentHistoricalTransactionsComponent;
    let fixture: ComponentFixture<PaymentHistoricalTransactionsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PaymentHistoricalTransactionsComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(
            PaymentHistoricalTransactionsComponent
        );
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
