import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-payment-historical-transactions',
    templateUrl: './payment-historical-transactions.component.html',
    styleUrls: ['./payment-historical-transactions.component.scss'],
})
export class PaymentHistoricalTransactionsComponent {
    @Input() title!: string;
    @Input() titleIcon!: string;
    @Input() Items!: any[];
    @Output() closeEmmiter: EventEmitter<any> = new EventEmitter();
}
