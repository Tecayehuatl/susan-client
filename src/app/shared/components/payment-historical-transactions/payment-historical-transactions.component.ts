import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import {
    OrdersQuotesService,
    Payment,
} from 'src/app/services/orders-quotes.service';
import { HistoricInfoItem } from '../historic-info/historic-info.component';
import {
    CreateEditPaymentsComponent,
    paymentTypes,
} from '../payments/create-edit-payments/create-edit-payments.component';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GetPaymentTypeTextPipe } from '../../pipes/get-payment-type-text.pipe';

@Component({
    selector: 'app-payment-historical-transactions',
    templateUrl: './payment-historical-transactions.component.html',
    styleUrls: ['./payment-historical-transactions.component.scss'],
})
export class PaymentHistoricalTransactionsComponent {
    @Input() title!: string;
    @Input() titleIcon!: string;
    @Input() orderStatusId!: number;
    @Input() paymentStatusId!: number | undefined;
    @Input() set incomingPayments(payments: Payment[]) {
        this.paymentsTransformed = this.transformPayments(payments);
    }
    @Input() orderId!: string;
    @Output() closeSidenavEmmit: EventEmitter<any> = new EventEmitter();
    @Output() setNewOrderData: EventEmitter<any> = new EventEmitter();
    @Output() deletePaymentFromOrderEmmit: EventEmitter<any> =
        new EventEmitter();

    paymentsTransformed: HistoricInfoItem[] = [];

    constructor(
        public orderQuoteService: OrdersQuotesService,
        private getPaymentTypeTextPipe: GetPaymentTypeTextPipe,
        public dialog: MatDialog,
        private _snackBar: MatSnackBar,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    transformPayments(payments: Payment[]): HistoricInfoItem[] {
        console.log(payments);
        const transformed: HistoricInfoItem[] = payments.map(
            (payment: Payment, index: number) => {
                let descripttion: string;
                if (payment.payment_id !== paymentTypes.CASH) {
                    descripttion = `Forma de pago: ${this.getPaymentTypeText(
                        payment.payment_id
                    )}`;
                } else {
                    descripttion = `Forma de pago: Efectivo, Dinero recibido: ${payment?.cash_received}, Cambio dado: ${payment?.change_due}`;
                }

                return {
                    id: payment.order_payment_id?.toString(),
                    title: `Pago ${index + 1}`,
                    subtitle: `Total: ${payment.total_transaction}`,
                    description: descripttion,
                    isDeleteActionIncluded: true,
                };
            }
        );
        return transformed;
    }

    getPaymentTypeText(paymentId: number): string {
        return this.getPaymentTypeTextPipe.transform(paymentId);
    }

    openAddPaymentDialog(): void {
        const dialogRef = this.dialog.open(CreateEditPaymentsComponent, {
            width: '1100px',
            minHeight: '500px',
            data: {
                orderId: this.orderId,
            },
        });

        dialogRef.afterClosed().subscribe((newPayment: Payment) => {
            if (newPayment) {
                this._snackBar.open(`Pago agregado correctamente`, 'CERRAR');
                this.setNewOrderData.emit(newPayment);
            }
        });
    }

    closeSidenav() {
        this.closeSidenavEmmit.emit('close');
    }

    deletePaymentFromOrder(orderPaymentId: string, orderId: string): void {
        this.orderQuoteService
            .deletePaymentFromOrder(orderId, orderPaymentId.toString())
            .subscribe(() => {
                //'response' will be null, the service currently does not return anything
                this.deletePaymentFromOrderEmmit.emit();
            });
    }
}
