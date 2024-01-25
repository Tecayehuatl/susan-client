import { Component, Inject, OnInit } from '@angular/core';
import {
    FormArray,
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogRef,
} from '@angular/material/dialog';
import { StudiesService } from 'src/app/services/studies.service';
import { Study } from '../../studies/studies.component';
import {
    Order,
    OrdersQuotesService,
} from 'src/app/services/orders-quotes.service';
import { MatTableDataSource } from '@angular/material/table';
import { getGrandTotal } from 'src/app/shared/utils/utils';
import { Discount, DiscountsService } from 'src/app/services/discounts.service';
import { PaymentMethod } from 'src/app/services/payment-methods.service';
import { Doctor } from '../../doctors/doctors.component';
import { AuthService } from 'src/app/services/auth.service';
import { CreateEditDoctorsComponent } from '../../doctors/create-edit-doctors/create-edit-doctors.component';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    datePickerDisabled = true;

    discounts: Discount[] = [];
    paymentMethods: PaymentMethod[] = [];
    doctors: Doctor[] = [];

    isSkippedPayment = false;

    totalOrder = 0;

    get orderFormArray(): FormArray {
        return this.orderForm.get('formArray') as FormArray;
    }

    get studiesFormArray(): FormArray {
        return this.orderFormArray.get([1])?.get('studies') as FormArray;
    }

    get doctorControl(): FormControl {
        return this.orderFormArray.get([1])?.get('doctorId') as FormControl;
    }

    get orderType(): string {
        if (this.orderFormArray.get([0])?.get('orderType')?.value === '1')
            return 'orden';
        if (this.orderFormArray.get([0])?.get('orderType')?.value === '2')
            return 'cotización';
        return '';
    }

    get orderDateControl(): FormControl {
        return this.orderFormArray.get([0])?.get('creationDate') as FormControl;
    }

    get orderTypeControl(): FormControl {
        return this.orderFormArray.get([0])?.get('orderType') as FormControl;
    }

    get discountsFormArray(): FormArray {
        return this.orderFormArray.get([1])?.get('discounts') as FormArray;
    }

    get paymentsFormArray(): FormArray {
        return this.orderFormArray.get([2])?.get('payments') as FormArray;
    }

    constructor(
        public dialogRef: MatDialogRef<CreateOrderQuoteComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        private dialog: MatDialog,
        private _snackBar: MatSnackBar,
        private fb: FormBuilder,
        private studiesService: StudiesService,
        private authService: AuthService,
        private ordersService: OrdersQuotesService,
        private discountsService: DiscountsService
    ) {
        this.paymentMethods = data.paymentMethods;
        this.doctors = data.doctors;
    }

    ngOnInit() {
        this.getDiscounts();
        this.createForm();
        this.dataSource = new MatTableDataSource(this.studiesFormArray.value);

        this.paymentsFormArray.valueChanges.subscribe((form: any) => {
            if (this.paymentsFormArray.controls.length >= 1)
                this.isSkippedPayment = false;
        });

        this.orderTypeControl.valueChanges.subscribe((value: any) => {
            // Quote
            if (value === '2') {
                this.disablePaymentValidators(true);
                this.paymentsFormArray.clear();
                this.isSkippedPayment = false;
                // Order
            } else if (value === '1') {
                this.disablePaymentValidators(false);
            }
        });
    }

    createForm(): void {
        this.orderForm = this.fb.group({
            formArray: this.fb.array([
                this.fb.group({
                    orderType: ['', Validators.required],
                    creationDate: [
                        { disabled: true, value: new Date() },
                        Validators.required,
                    ],
                }),
                this.fb.group({
                    doctorId: [null, Validators.required],
                    studies: this.fb.array(
                        [],
                        [Validators.required, Validators.minLength(1)]
                    ),
                    discounts: this.fb.array([]),
                }),
                this.fb.group({
                    payments: this.fb.array(
                        [],
                        [Validators.required, Validators.minLength(1)]
                    ),
                }),
            ]),
        });
    }

    addStudyGroupForm(study: Study): FormGroup {
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
            const _query = query.target.value.trim();

            this.studiesService
                .searchStudies(_query)
                .subscribe(
                    (studies: Study[]) => (this.studiesFiltered = studies)
                );
        }, 0);
    }

    addStudy(study: Study): void {
        this.studiesFormArray.insert(
            this.studiesFormArray.controls.length,
            this.addStudyGroupForm(study)
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

    getDiscounts(): void {
        this.discountsService
            .getDiscounts()
            .subscribe((discounts: Discount[]) => {
                this.discounts = discounts;
            });
    }

    setDiscountsForm(discountsFormArray: []) {
        this.discountsFormArray.clear();

        discountsFormArray?.forEach((control) => {
            this.discountsFormArray.insert(
                this.discountsFormArray.length,
                this.fb.group({
                    discount_id: [control['discount_id']],
                    name: [control['name'], Validators.required],
                    discountPercentage: [
                        control['discountPercentage'],
                        Validators.required,
                    ],
                })
            );
        });
    }

    addPaymentGroup(): void {
        this.paymentsFormArray.insert(
            this.paymentsFormArray.length,
            this.fb.group({
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

    getPayementGroup(index: number): FormGroup {
        return this.paymentsFormArray.get([index]) as FormGroup;
    }

    removePayment(indexPayment: number): void {
        this.paymentsFormArray.removeAt(indexPayment);
    }

    disablePaymentValidators(isChecked: boolean): void {
        if (isChecked) {
            this.paymentsFormArray.removeValidators([
                Validators.required,
                Validators.minLength(1),
            ]);
            this.paymentsFormArray.updateValueAndValidity();
            return;
        } else {
            this.paymentsFormArray.addValidators([
                Validators.required,
                Validators.minLength(1),
            ]);
            this.paymentsFormArray.updateValueAndValidity();
        }
    }

    createOrderQuote(): void {
        const payload = {
            branch_office_id: +this.authService.userSystemData.branch_office_id,
            created_at: this.orderDateControl.value,
            order_type_id: +this.orderTypeControl.value,
            // todo: removed this harcoded data
            // 1: ongoing, 2 cancelled, 3 closed
            order_status_id: 1,
            // 1: completed, 2 pending, 3 cancelled
            // payment_status_id: 1,
            // 1: delivered, 2: not delivered, 3: cancelled
            delivery_status_id: 2,
            patient_id: this.data.patient_id,
            doctor_id: +this.doctorControl.value,
            studies: this.studiesFormArray.value,
            payments: this.paymentsFormArray.value,
            discounts: this.discountsFormArray.value,
            notes: [],
        };
        // TODO: Return the item just created, update the table and close the dialog
        this.ordersService
            .createOrder(payload as Order)
            .subscribe((response) => {
                this.dialogRef.close(response);
            });
    }

    openCreateEditDoctorDialog(): void {
        const dialogRef = this.dialog.open(CreateEditDoctorsComponent, {
            width: '1100px',
            minHeight: '500px',
        });

        dialogRef.afterClosed().subscribe(({ formValues, mode }) => {
            if (formValues && mode === 'create') {
                // Updating the local datasource
                this.doctors = [formValues, ...this.doctors];
                this._snackBar.open(
                    `DOCTOR: ${formValues.first_name} CREADA`,
                    'CERRAR'
                );
            }
        });
    }
}

export interface DialogData {
    title: string;
    itemData: any;
    paymentMethods: PaymentMethod[];
    doctors: Doctor[];
    patient_id: number;
}
