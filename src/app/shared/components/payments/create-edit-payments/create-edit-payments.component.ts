import { Component, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OrdersQuotesService } from 'src/app/services/orders-quotes.service';

@Component({
    selector: 'app-create-edit-payments',
    templateUrl: './create-edit-payments.component.html',
    styleUrls: ['./create-edit-payments.component.scss'],
})
export class CreateEditPaymentsComponent {
    // TODO: Make this payment methods dynamic
    paymentMethods = [
        {
            payment_id: 1,
            name: 'Efectivo',
        },
        {
            payment_id: 2,
            name: 'Tarjeta de Crédito',
        },
        {
            payment_id: 3,
            name: 'Tarjeta de Débito',
        },
        {
            payment_id: 4,
            name: 'Vales de Despensa',
        },
        {
            payment_id: 5,
            name: 'Cheque',
        },
        {
            payment_id: 6,
            name: 'Transferencia Bancaria',
        },
    ];

    paymentsForm: FormGroup = this._fb.group({
        payments: this._fb.array([
            this._fb.group({
                payment_id: [null, Validators.required],
                total_transaction: [null, [Validators.required]],
                cash_received: [null],
                change_due: [null],
            }),
        ]),
    });

    get paymentsFormArray(): FormArray {
        return this.paymentsForm.get('payments') as FormArray;
    }

    constructor(
        public dialogRef: MatDialogRef<CreateEditPaymentsComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _fb: FormBuilder,
        private orderService: OrdersQuotesService
    ) {}

    removePayment(indexPayment: number): void {
        this.paymentsFormArray.removeAt(indexPayment);
    }

    getPayementGroup(index: number): FormGroup {
        return this.paymentsFormArray.get([index]) as FormGroup;
    }

    addPaymentGroup(): void {
        this.paymentsFormArray.insert(
            this.paymentsFormArray.length,
            this._fb.group({
                payment_id: [null, Validators.required],
                total_transaction: [
                    null,
                    [Validators.required, Validators.min(1)],
                ],
                cash_received: [null],
                change_due: [null],
            })
        );
    }

    addPaymentToOrder(): void {
        const payments = {
            payments: this.paymentsFormArray.value,
        };

        // TODO: Send the paymentsFormArray back to the view, currently the API response don't return the payments recently added
        this.orderService
            .updateOrder(payments, this.data.orderId)
            .subscribe((data) => {
                this.dialogRef.close(payments);
            });
    }
}
