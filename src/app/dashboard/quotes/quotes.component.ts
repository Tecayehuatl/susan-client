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
import { DatePipe, formatDate } from '@angular/common';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

@Component({
    selector: 'app-quotes',
    templateUrl: './quotes.component.html',
    styleUrls: ['./quotes.component.scss'],
})
export class QuotesComponent implements OnInit {
    title = 'PACIENTES';
    displayedColumns: string[] = [
        'order_id',
        'patientName',
        'age',
        'email',
        'date_birth',
        'created_at',
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
            console.log('Valid form, requesting data...');
            const extractedValues = this.extractFormValues(this.searchForm);

            console.log('extractedValues: ');
            console.log(extractedValues);

            // Call the original function with no 'search' parameter
            if (Object.keys(extractedValues).length === 0) {
                console.log('Calling initial call...');
                this.getQuotes({});
                return;
            }

            console.log('Calling NO initialcall...');
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

    setDateRange(start: any, end: any): void {
        // Converting the start and end strings to real dates using Date object form JavaScript

        // if (start.value && end.value) {
        //     const datePipe = new DatePipe('es-MX');
        //     const [startDay, startMonth, startYear] = start.value.split('/');
        //     const startDateObject = new Date(
        //         startYear,
        //         startMonth - 1,
        //         startDay
        //     );

        //     this.order
        //         .get('created_at')
        //         ?.get('from')
        //         ?.setValue(datePipe.transform(startDateObject, 'yyyy-MM-dd'));

        //     const endDatePipe = new DatePipe('es-MX');
        //     const [endDay, endMonth, endYear] = end.value.split('/');
        //     const endDateObject = new Date(endYear, endMonth - 1, endDay);

        //     this.order
        //         .get('created_at')
        //         ?.get('to')
        //         ?.setValue(endDatePipe.transform(endDateObject, 'yyyy-MM-dd'));

        //     this.searchPatients();
        // }

        if (start?.value) {
            const datePipe = new DatePipe('es-MX');
            const [day, month, year] = start.value.split('/');
            const dateObject = new Date(year, month - 1, day);

            const temp = datePipe.transform(dateObject, 'yyyy-MM-dd');

            this.order.get('created_at')?.get('from')?.patchValue(temp);
        }

        if (end?.value) {
            const endDatePipe = new DatePipe('es-MX');
            const [day, month, year] = end.value.split('/');
            const dateObject = new Date(year, month - 1, day);

            this.order
                .get('created_at')
                ?.get('to')
                ?.patchValue(endDatePipe.transform(dateObject, 'yyyy-MM-dd'));
        }

        if (start.value && end.value) {
            this.searchPatients();
        }
    }

    setDateRangeTest(event: MatDatepickerInputEvent<Date>) {
        // todo: ME QUEDE PROBANDO ESTE PEDO, NO SE PUDO CONVERTIR LA FECHA Y HAY UN ISSUE CUANDO SE SELECCIONA EL RANGO, ESTABA VIENDO EJEMPLOS DE STACKBLITZ PARA VER COMO IMPLEMENTAN, AHORITA CAMBIE EL PARÁMETRO DE ESTA FUNCION DE START, END A EVENTM, PERO AUN NO ESTOY SEGURO COMO PODRÓA AYUDAR, NO RESPETA LOS RANGOS EL COMPONENTE DE ANGULAR CUANDO CONVIERTO https://stackblitz.com/edit/angular-date-range-picker-actions-n331ly?file=src%2Fapp%2Fdate-range-picker-forms-example.html,src%2Fapp%2Fdate-range-picker-forms-example.ts, RECOMENDACION: LEER MAS LA DOCUMENTACION DEL DATE PICKER RANGE Y VER PORQUE FALLA https://v14.material.angular.io/components/datepicker/overview
        console.log(event);
        const datePipe = new DatePipe('es-MX');
        const temp = datePipe.transform(event.value, 'yyyy-MM-dd');
        console.log('RESULTADO: ', temp);
        this.orderTest.get('created_at')?.get('from')?.patchValue(temp);

        // if (start?.value) {
        //     console.log('start?.value: ', start?.value);

        //     // const datePipe = new DatePipe('es-MX');
        //     // const [day, month, year] = start.value.split('/');
        //     // const dateObject = new Date(year, month - 1, day);

        //     // const temp = datePipe.transform(dateObject, 'short');

        //     // this.orderTest.get('created_at')?.get('from')?.patchValue(temp);
        // }

        // if (end?.value) {
        //     const endDatePipe = new DatePipe('es-MX');
        //     const [day, month, year] = end.value.split('/');
        //     const dateObject = new Date(year, month - 1, day);

        //     this.orderTest
        //         .get('created_at')
        //         ?.get('to')
        //         ?.patchValue(endDatePipe.transform(dateObject, 'yy/MM/dd'));
        // }
    }

    resetFormFilters(): void {
        this.searchForm.reset();
        this.searchPatients();

        // this.matStartDate.nativeElement.value = null;
        // this.matEndDate.nativeElement.value = null;
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
