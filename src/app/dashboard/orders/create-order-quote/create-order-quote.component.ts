import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { StudiesService } from 'src/app/services/studies.service';
import { Study } from '../../studies/studies.component';
import { OrdersQuotesService } from 'src/app/services/orders-quotes.service';

@Component({
    selector: 'app-create-order-quote',
    templateUrl: './create-order-quote.component.html',
    styleUrls: ['./create-order-quote.component.scss'],
})
export class CreateOrderQuoteComponent implements OnInit {
    mode!: 'create' | 'edit';
    title!: string;
    orderForm!: FormGroup;
    studies: Study[] = [];

    constructor(
        public dialogRef: MatDialogRef<CreateOrderQuoteComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        private fb: FormBuilder,
        private studiesService: StudiesService,
        private ordersService: OrdersQuotesService
    ) {}

    ngOnInit() {
        this.studiesService
            .getStudies()
            .subscribe((studies: Study[]) => (this.studies = studies));
        this.createForm();
    }

    createForm(): void {
        this.orderForm = this.fb.group({
            first_name: ['', Validators.required],
            middle_name: [''],
            last_name: [''],
            phone1: '',
            phone2: [''],
            cedula: ['', [Validators.maxLength(15)]],
            email: [''],
        });
    }

    createUpdateItem(): void {
        const formValues = {
            ...this.orderForm.value,
        };

        this.ordersService
            .createOrder(formValues)
            .subscribe((response: any) => {
                this.dialogRef.close({
                    formValues: response,
                });
            });
    }
}

export interface DialogData {
    title: string;
    itemData: any;
}
