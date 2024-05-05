import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CreateOrderQuoteComponent } from '../../orders/create-order-quote/create-order-quote.component';
import { Study } from '../../studies/studies.component';
import { ActivatedRoute } from '@angular/router';
import { PaymentMethod } from 'src/app/services/payment-methods.service';
import { Doctor } from '../../doctors/doctors.component';
import { Patient } from '../patients.component';
import { Order } from 'src/app/services/orders-quotes.service';
import { MatTabGroup } from '@angular/material/tabs';

@Component({
    selector: 'app-patient-detail',
    templateUrl: './patient-detail.component.html',
    styleUrls: ['./patient-detail.component.scss'],
})
export class PatientDetailComponent implements OnInit {
    studies!: Study[];
    paymentMethods: PaymentMethod[] = [];
    doctors: Doctor[] = [];
    patient!: Patient;

    patientAllOrdersQuotes!: Order[];
    patientAllOrders!: Order[];
    patientAllQuotes!: Order[];

    @ViewChild(MatTabGroup) tabGroup!: MatTabGroup;

    constructor(
        private dialog: MatDialog,
        private _snackBar: MatSnackBar,
        private route: ActivatedRoute
    ) {
        this.paymentMethods = this.route.snapshot.data['paymentMethods'];
        this.doctors = this.route.snapshot.data['doctors'];
        this.patient = this.route.snapshot.data['patient'];
        this.patientAllOrdersQuotes =
            this.route.snapshot.data['patientAllOrdersQuotes'];
    }

    ngOnInit(): void {
        this.filterOrdersAndQuotes(this.patientAllOrdersQuotes);
    }

    openCreateOrderQuote(): void {
        const dialogRef = this.dialog.open(CreateOrderQuoteComponent, {
            width: '1200px',
            minHeight: '500px',
            data: {
                paymentMethods: this.paymentMethods,
                doctors: this.doctors,
                patient_id: this.patient.patient_id,
            },
        });

        dialogRef.afterClosed().subscribe((response) => {
            const newItemAdded = {
                ...response,
                order_type_id: response.order_type_id,
                order_id: response.order_id,
                created_at: response.created_at,
                order_status_id: response.order_status_id,
                payment_status_id: response.payment_status_id,
                delivery_status_id: response.delivery_status_id,
                grand_total: response.grand_total,
                balance: response.balance,
            } as Order;

            this.patientAllOrdersQuotes = [
                ...this.patientAllOrdersQuotes,
                newItemAdded,
            ];

            this.filterOrdersAndQuotes(this.patientAllOrdersQuotes);

            // Moving to the order or quote
            this.tabGroup.selectedIndex = newItemAdded.order_type_id - 1;

            this._snackBar.open(`ORDEN CREADA`, 'CERRAR');
        });
    }

    setNewincomingOrdersQuotes(elementRemoved: Order): void {
        const filteredData = this.patientAllOrdersQuotes.filter(
            (element) => element.order_id !== elementRemoved.order_id
        );

        this.patientAllOrdersQuotes = filteredData;
        this.filterOrdersAndQuotes(this.patientAllOrdersQuotes);
    }

    filterOrdersAndQuotes(allOrdersAndQuotes: Order[]): void {
        // 1: order
        this.patientAllOrders = allOrdersAndQuotes.filter(
            (order) => order.order_type_id === 1
        );
        // 2: quote
        this.patientAllQuotes = allOrdersAndQuotes.filter(
            (order) => order.order_type_id === 2
        );
    }
}
