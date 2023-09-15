import { Component, Input, OnInit } from '@angular/core';
import { Payment } from 'src/app/services/orders-quotes.service';
import { HistoricInfoItem } from '../historic-info/historic-info.component';

@Component({
    selector: 'app-payment-historical-transactions',
    templateUrl: './payment-historical-transactions.component.html',
    styleUrls: ['./payment-historical-transactions.component.scss'],
})
export class PaymentHistoricalTransactionsComponent implements OnInit {
    @Input() title!: string;
    @Input() titleIcon!: string;
    @Input() payments: Payment[] = [];
    paymentsTransformed: HistoricInfoItem[] = [];

    ngOnInit(): void {
        this.paymentsTransformed = this.transformNotes(this.payments);
    }

    transformNotes(payments: Payment[]): HistoricInfoItem[] {
        const transformed: HistoricInfoItem[] = payments.map(
            (payment: Payment) => ({
                title: `${payment.payment_id}`,
                subtitle: `${payment.total_transaction} - ${payment.payment_id}`,
                description: `${payment.change_due} ${payment.cash_received}`,
            })
        );
        return transformed;
    }
}
