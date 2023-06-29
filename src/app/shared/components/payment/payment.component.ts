import { Component } from '@angular/core';

@Component({
    selector: 'app-payment',
    templateUrl: './payment.component.html',
    styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent {
    paymentTypes: PaymentType[] = [
        {
            name: 'Tarjeta de crédito',
            valueText: PaymentTypes.creditCard,
        },
        {
            name: 'Tarjeta de débito',
            valueText: PaymentTypes.debitCard,
        },
        {
            name: 'Tarjeta de vales de despensa',
            valueText: PaymentTypes.foodVoucher,
        },
        {
            name: 'Efectivo',
            valueText: PaymentTypes.cash,
        },
        {
            name: 'Transferencia electrónica',
            valueText: PaymentTypes.transfer,
        },
    ];
}

interface PaymentType {
    name: string;
    valueText: string;
}

enum PaymentTypes {
    creditCard = 'CREDIT_CARD',
    debitCard = 'DEBIT_CARD',
    foodVoucher = 'FOOD_VOUCHER',
    cash = 'CASH',
    transfer = 'TRANSFER',
}
