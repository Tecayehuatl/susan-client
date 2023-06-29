import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { StudiesService } from 'src/app/services/studies.service';
import { Study } from '../../studies/studies.component';
import { OrdersQuotesService } from 'src/app/services/orders-quotes.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
    selector: 'app-create-order-quote',
    templateUrl: './create-order-quote.component.html',
    styleUrls: ['./create-order-quote.component.scss'],
})
export class CreateOrderQuoteComponent implements OnInit {
    mode!: 'create' | 'edit';
    title!: string;
    displayedColumns: string[] = [
        'study_id',
        'name',
        'alias',
        'price',
        'discountPercentage',
        'grandTotal',
        'deliveryDays',
        'delete',
    ];
    dataSource!: MatTableDataSource<Study>;

    orderForm!: FormGroup;
    studies: Study[] = [];
    firstFormGroup = this.fb.group({
        firstCtrl: ['', Validators.required],
    });
    secondFormGroup = this.fb.group({
        secondCtrl: ['', Validators.required],
    });
    isLinear = false;
    @ViewChild(MatSort) sort!: MatSort;

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
        const temp: Study[] = [
            {
                study_id: '1',
                name: 'EGO TEMP',
                alias: '',
                price: 10,
                discountPercentage: 0,
                grandTotal: 90,
                deliveryDays: 1,
                conditions: '',
                notes: '',
            },
        ];
        this.dataSource = new MatTableDataSource(temp as Study[]);
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

    applyFilter(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    removeAt(index: number): void {
        const data = this.dataSource.data;
        // data.splice(
        //     this.paginator.pageIndex * this.paginator.pageSize + index,
        //     1
        // );
        this.dataSource.data = data;
    }
}

export interface DialogData {
    title: string;
    itemData: any;
}
