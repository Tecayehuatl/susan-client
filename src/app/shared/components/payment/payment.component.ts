import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
    FormControl,
    FormGroup,
    FormGroupDirective,
    Validators,
} from '@angular/forms';
import { PaymentMethod } from 'src/app/services/payment-methods.service';

@Component({
    selector: 'app-payment',
    templateUrl: './payment.component.html',
    styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnInit {
    @Input() paymentMethods: PaymentMethod[] = [];
    @Input() paymentFormGroup!: FormGroup;
    @Input() indexPayment!: number;
    @Output() removePaymentEvent: EventEmitter<any> = new EventEmitter<any>();

    get paymentIdControl(): FormControl {
        return this.paymentFormGroup.get('payment_id') as FormControl;
    }
    get totalTransactionControl(): FormControl {
        return this.paymentFormGroup.get('total_transaction') as FormControl;
    }
    get cashReceivedControl(): FormControl {
        return this.paymentFormGroup.get('cash_received') as FormControl;
    }
    get changeDueControl(): FormControl {
        return this.paymentFormGroup.get('change_due') as FormControl;
    }

    constructor(private rootFormGroup: FormGroupDirective) {}

    ngOnInit(): void {
        this.paymentFormGroup = this.rootFormGroup.control;

        this.totalTransactionControl.valueChanges.subscribe((total: number) => {
            if (
                +this.paymentIdControl.value === 1 &&
                this.cashReceivedControl.value > 0
            ) {
                const change = +this.cashReceivedControl.value - total;
                this.changeDueControl?.setValue(+change.toFixed(2));
            }
        });

        this.cashReceivedControl.valueChanges.subscribe(
            (cashReceived: number) => {
                if (
                    +this.paymentIdControl.value === 1 &&
                    this.totalTransactionControl.value > 0 &&
                    +cashReceived > 0
                ) {
                    const change =
                        +cashReceived - +this.totalTransactionControl.value;

                    this.changeDueControl?.setValue(+change.toFixed(2));
                }
            }
        );

        this.paymentIdControl.valueChanges.subscribe((value) => {
            if (value && value === 1) {
                this.cashReceivedControl.setValidators([
                    Validators.required,
                    Validators.min(1),
                ]);
                this.cashReceivedControl.updateValueAndValidity();
            } else {
                this.cashReceivedControl.removeValidators([
                    Validators.required,
                    Validators.min(1),
                ]);
                this.cashReceivedControl.setValue(null);
                this.changeDueControl.setValue(null);
                this.cashReceivedControl.updateValueAndValidity();
                this.changeDueControl.updateValueAndValidity();
            }
        });
    }

    removePayment(indexPayment: number): void {
        this.removePaymentEvent.emit(indexPayment);
    }
}
