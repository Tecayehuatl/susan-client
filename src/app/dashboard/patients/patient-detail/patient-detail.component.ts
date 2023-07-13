import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CreateOrderQuoteComponent } from '../../orders/create-order-quote/create-order-quote.component';
import { Study } from '../../studies/studies.component';
import { ActivatedRoute } from '@angular/router';
import { PaymentMethod } from 'src/app/services/payment-methods.service';
import { Doctor } from '../../doctors/doctors.component';

@Component({
    selector: 'app-patient-detail',
    templateUrl: './patient-detail.component.html',
    styleUrls: ['./patient-detail.component.scss'],
})
export class PatientDetailComponent {
    studies!: Study[];
    paymentMethods: PaymentMethod[] = [];
    doctors: Doctor[] = [];

    constructor(
        private dialog: MatDialog,
        private _snackBar: MatSnackBar,
        private route: ActivatedRoute
    ) {
        console.log(this.route);

        this.paymentMethods = this.route.snapshot.data['paymentMethods'];
        this.doctors = this.route.snapshot.data['doctors'];
    }

    openCreateOrderQuote(): void {
        const dialogRef = this.dialog.open(CreateOrderQuoteComponent, {
            width: '1200px',
            minHeight: '500px',
            data: {
                paymentMethods: this.paymentMethods,
                doctors: this.doctors,
            },
        });

        dialogRef.afterClosed().subscribe(({ formValues, mode }) => {
            // if (formValues && mode === 'create') {
            //     // Updating the local datasource
            //     const newDataSource = this.dataSource.data;
            //     this.dataSource.data = [formValues, ...newDataSource];
            //     this._snackBar.open(
            //         `DOCTOR: ${formValues.first_name} CREADA`,
            //         'CERRAR'
            //     );
            // } else if (formValues && mode === 'edit') {
            //     // Updating the local datasource
            //     const data = this.dataSource.data;
            //     const newDataSource = data.map((doctor: Doctor, i) => {
            //         if (i === index) {
            //             return formValues;
            //         }
            //         return doctor;
            //     });
            //     this.dataSource.data = newDataSource;
            //     this._snackBar.open(
            //         `DOCTOR: ${formValues.first_name} ACTUALIZADO`,
            //         'CERRAR'
            //     );
            // }
        });
    }
}
