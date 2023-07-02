import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import {
    FormArray,
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { StudiesService } from 'src/app/services/studies.service';
import { Study } from '../../studies/studies.component';
import { OrdersQuotesService } from 'src/app/services/orders-quotes.service';
import { MatTableDataSource } from '@angular/material/table';
import { getGrandTotal } from 'src/app/shared/utils/utils';

@Component({
    selector: 'app-create-order-quote',
    templateUrl: './create-order-quote.component.html',
    styleUrls: ['./create-order-quote.component.scss'],
})
export class CreateOrderQuoteComponent implements OnInit {
    displayedColumns: string[] = [
        'study_id',
        'name',
        'alias',
        'price',
        'discountPercentage',
        'grandTotal',
        'deliveryDays',
        'editDelete',
    ];
    dataSource!: MatTableDataSource<Study>;

    orderForm!: FormGroup;

    searchStudiesControl = new FormControl('');
    studiesFiltered: Study[] = [];

    timer: any;
    delaySearch = true;

    get orderFormArray(): FormArray {
        return this.orderForm.get('formArray') as FormArray;
    }

    get studiesFormArray(): FormArray {
        return this.orderFormArray.get([1])?.get('studies') as FormArray;
    }

    get orderType(): string {
        if (this.orderFormArray.get([0])?.get('orderType')?.value === '1')
            return 'orden';
        if (this.orderFormArray.get([0])?.get('orderType')?.value === '2')
            return 'cotización';
        return '';
    }

    constructor(
        public dialogRef: MatDialogRef<CreateOrderQuoteComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        private fb: FormBuilder,
        private studiesService: StudiesService,
        private ordersService: OrdersQuotesService
    ) {}

    ngOnInit() {
        this.createForm();
        this.dataSource = new MatTableDataSource(this.studiesFormArray.value);
    }

    createForm(): void {
        this.orderForm = this.fb.group({
            formArray: this.fb.array([
                this.fb.group({
                    orderType: ['', Validators.required],
                }),
                this.fb.group({
                    studies: this.fb.array(
                        [],
                        [Validators.required, Validators.minLength(1)]
                    ),
                    discounts: [],
                }),
                this.fb.group({}),
            ]),
        });
    }

    initiateVOForm(study: Study): FormGroup {
        return this.fb.group({
            study_id: new FormControl(study.study_id || ''),
            name: new FormControl(study.name || ''),
            alias: new FormControl(study.alias || ''),
            price: new FormControl(study.price || ''),
            grandTotal: new FormControl(study.grandTotal || ''),
            discountPercentage: new FormControl(study.discountPercentage || ''),
            deliveryDays: new FormControl(study.deliveryDays || ''),
            conditions: new FormControl(study.conditions || ''),
            notes: new FormControl(study.notes || ''),
            isEditable: new FormControl(false),
        });
    }

    searchStudies(query: any): void {
        if (this.timer) {
            clearTimeout(this.timer);
        }

        this.timer = setTimeout(() => {
            const _query = query.target.value;

            this.studiesService
                .searchStudies(_query)
                .subscribe(
                    (studies: Study[]) => (this.studiesFiltered = studies)
                );
        }, 1000);
    }

    addStudy(study: Study): void {
        this.studiesFormArray.insert(
            this.studiesFormArray.controls.length,
            this.initiateVOForm(study)
        );

        this.dataSource.data = [...this.studiesFormArray.value];
    }

    addValueChangesListener(index: number): void {
        // This function will add a subscription to price and discount controls
        const priceControl = this.studiesFormArray.get([index])?.get('price');
        const discountControl = this.studiesFormArray
            .get([index])
            ?.get('discountPercentage');
        const grandTotalControl = this.studiesFormArray
            .get([index])
            ?.get('grandTotal');

        priceControl?.valueChanges.subscribe((value) => {
            const total = getGrandTotal(+value, +discountControl?.value);
            grandTotalControl?.setValue(total);
            if (this.timer) {
                clearTimeout(this.timer);
            }

            this.timer = setTimeout(() => {
                this.saveEditStudy();
            }, 1000);
        });

        discountControl?.valueChanges.subscribe((value) => {
            const total = getGrandTotal(+priceControl?.value, +value);
            grandTotalControl?.setValue(total);
            if (this.timer) {
                clearTimeout(this.timer);
            }

            this.timer = setTimeout(() => {
                this.saveEditStudy();
            }, 1000);
        });
    }

    editStudy(index: number): void {
        const currentIsEditableValue = this.studiesFormArray
            .get([index])
            ?.get('isEditable');
        currentIsEditableValue?.setValue(!currentIsEditableValue.value);
        this.addValueChangesListener(index);
    }

    saveEditStudy(): void {
        this.dataSource.data = [...this.studiesFormArray.value];
    }

    removeAt(index: number): void {
        this.studiesFormArray.removeAt(index);
        this.dataSource.data = [...this.studiesFormArray.value];
    }
}

export interface DialogData {
    title: string;
    itemData: any;
}
