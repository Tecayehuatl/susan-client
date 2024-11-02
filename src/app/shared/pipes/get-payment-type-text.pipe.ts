import { Pipe, PipeTransform } from '@angular/core';
import { paymentTypes } from '../components/payments/create-edit-payments/create-edit-payments.component';

@Pipe({
    name: 'getPaymentTypeText',
    pure: true,
})
export class GetPaymentTypeTextPipe implements PipeTransform {
    transform(paymentId: number): string {
        let typeText = '';
        switch (paymentId) {
            case paymentTypes.CASH:
                typeText = 'Efectivo';
                break;
            case paymentTypes.CREDIT_CARD:
                typeText = 'Tarjeta de crédito';
                break;
            case paymentTypes.DEBIT_CARD:
                typeText = 'Tarjeta de débito';
                break;
            case paymentTypes.FOOD_VOUCHER:
                typeText = 'Vales de despensa';
                break;
            case paymentTypes.CHECK:
                typeText = 'Cheque';
                break;
            case paymentTypes.BANK_TRANSACTION:
                typeText = 'Transferencia interbancaria';
                break;
            default:
                typeText = '';
                break;
        }
        return typeText;
    }
}
