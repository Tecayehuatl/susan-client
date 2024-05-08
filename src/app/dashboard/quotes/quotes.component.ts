import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import {
    Order,
    OrdersQuotesService,
} from 'src/app/services/orders-quotes.service';
import { Doctor } from '../doctors/doctors.component';
import { Study } from '../studies/studies.component';
import { BranchOffice } from '../branch-offices/branch-offices.component';
import { PaymentMethod } from 'src/app/services/payment-methods.service';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-quotes',
    templateUrl: './quotes.component.html',
    styleUrls: ['./quotes.component.scss'],
})
export class QuotesComponent implements OnInit {
    title = 'PACIENTES';
    displayedColumns: string[] = [
        'order_id',
        'created_at',
        'patientName',
        'age',
        'email',
        'date_birth',
        'branch_office',
        'doctorName',
        'grandTotal',
    ];
    genders = [
        { name: 'Masculino', value: 'male' },
        { name: 'Femenino', value: 'female' },
    ];
    filterPanelState = false;
    dataSource!: MatTableDataSource<Order>;
    timer: any;
    searchForm!: FormGroup;
    testForm!: FormGroup;

    doctors: Doctor[] = [];
    studies: Study[] = [];
    branchOffices: BranchOffice[] = [];
    paymentMethods: PaymentMethod[] = [];
    ageList = this.generateNumberList(1, 120);

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    @ViewChild('matStartDate') matStartDate!: ElementRef;
    @ViewChild('matEndDate') matEndDate!: ElementRef;

    // @ViewChild('matStartDate') matStartDate!: ElementRef;
    // @ViewChild('matEndDate') matEndDate!: ElementRef;

    get patient(): FormGroup {
        return this.searchForm.get('patient') as FormGroup;
    }

    get patientAge(): FormGroup {
        return this.patient.get('age') as FormGroup;
    }

    get order(): FormGroup {
        return this.searchForm.get('order') as FormGroup;
    }

    get orderTest(): FormGroup {
        return this.testForm.get('order') as FormGroup;
    }

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private ordersQuotesService: OrdersQuotesService
    ) {
        this.doctors = this.route.snapshot.data['doctors'];
        this.studies = this.route.snapshot.data['studies'];
        this.branchOffices = this.route.snapshot.data['branchOffices'];
        this.paymentMethods = this.route.snapshot.data['paymentMethods'];
    }

    ngOnInit(): void {
        this.testForm = this.fb.group({
            order: this.fb.group({
                created_at: this.fb.group({
                    from: null,
                    to: null,
                }),
            }),
        });

        this.searchForm = this.fb.group({
            doctorIds: [],
            studyIds: [],
            branchOfficeIds: [],
            paymentIds: [],
            patient: this.fb.group({
                age: this.fb.group({
                    from: null,
                    to: null,
                }),
            }),

            order: this.fb.group({
                created_at: this.fb.group({
                    from: null,
                    to: null,
                }),
                total: this.fb.group({
                    from: null,
                    to: null,
                }),
            }),
        });

        this.getQuotes();

        // this.order
        //     .get('created_at')
        //     ?.get('from')
        //     ?.valueChanges.subscribe((changes) => {
        //         const currentValue = this.order
        //             .get('created_at')
        //             ?.get('from')?.value;
        //         debugger;
        //         if (currentValue !== changes) {
        //             this.setDateRange(
        //                 changes,
        //                 this.order.get('created_at')?.get('to')?.value
        //             );
        //         }
        //     });

        // this.order
        //     .get('created_at')
        //     ?.get('to')
        //     ?.valueChanges.subscribe((changes) => {
        //         const currentValue = this.order
        //             .get('created_at')
        //             ?.get('to')?.value;
        //         debugger;
        //         if (currentValue !== changes) {
        //             this.setDateRange(
        //                 this.order.get('created_at')?.get('from')?.value,
        //                 changes
        //             );
        //         }
        //     });
    }

    getQuotes(params: object = {}): void {
        this.ordersQuotesService
            .getOrdersAndQuotes(params)
            .subscribe((response) => {
                // Assign the data to the data source for the table to render
                this.dataSource = new MatTableDataSource(response.data);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
            });
    }

    searchPatients(): void {
        if (this.timer) {
            clearTimeout(this.timer);
        }

        if (!this.searchForm.valid) {
            return;
        }

        this.timer = setTimeout(() => {
            const extractedValues = this.extractFormValues(this.searchForm);

            // Call the original function with no 'search' parameter
            if (Object.keys(extractedValues).length === 0) {
                this.getQuotes({});
                return;
            }

            const startDate = this.matStartDate.nativeElement.value;
            const endDate = this.matEndDate.nativeElement.value;

            if (startDate && endDate) {
                extractedValues['order'].created_at.from =
                    this.setDateRange(startDate);
                extractedValues['order'].created_at.to =
                    this.setDateRange(endDate);
            }

            this.getQuotes(extractedValues);
        }, 1000);
    }

    extractFormValues(formGroup: FormGroup | null): { [key: string]: any } {
        if (!formGroup) {
            return {};
        }

        const formValues: { [key: string]: any } = {};

        Object.keys(formGroup.controls).forEach((key) => {
            const control = formGroup.get(key);

            if (control instanceof FormGroup) {
                // Recursively call for nested FormGroup

                const nestedObject = this.extractFormValues(
                    formGroup.get(key) as FormGroup
                );

                // This will check if the iterated control has any valid value
                // if has, it will append to the new object that is being created above
                if (Object.keys(nestedObject).length > 0) {
                    formValues[key] = nestedObject;
                }
            } else {
                if (
                    Array.isArray(control?.value) &&
                    control?.value.length === 0
                ) {
                    return;
                }
                if (control?.value) formValues[key] = control?.value;
            }
        });

        return formValues;
    }

    generateNumberList(start: number, end: number): number[] {
        const numberList: number[] = [];
        for (let i = start; i <= end; i++) {
            numberList.push(i);
        }
        return numberList;
    }

    setDateRange(date: any): string | null {
        const [day, month, year] = date.split('/');
        const startDateObject = new Date(year, month - 1, day);
        const datePipe = new DatePipe('es-MX');
        return datePipe.transform(startDateObject, 'yyyy-MM-dd');
    }

    resetFormFilters(): void {
        this.searchForm.reset();
        this.searchPatients();
    }
}

export interface Quote {
    order_id: string;
    user_id: number;
    branch_office_id: number;
    order_type_id: number;
    order_status_id: number;
    payment_status_id: number;
    delivery_status_id: number;
    patient_id: string;
    doctor_id: number;
    grand_total: number;
    total: number;
    discount: number;
    subtotal: number;
    sales_tax: number;
    total_paid: number;
    balance: number;
    delivery_days: number;
    created_at: string;
}
