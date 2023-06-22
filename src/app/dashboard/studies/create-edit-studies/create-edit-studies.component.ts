import { Component, Inject, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { getGrandTotal } from 'src/app/shared/utils/utils';

@Component({
    selector: 'app-create-edit-studies',
    templateUrl: './create-edit-studies.component.html',
    styleUrls: ['./create-edit-studies.component.scss'],
})
export class CreateEditStudiesComponent implements OnInit {
    mode!: 'create' | 'edit';
    title!: string;
    studyForm!: FormGroup;

    get priceControl(): FormControl {
        return this.studyForm.get('price') as FormControl;
    }

    get discountPercentageControl(): FormControl {
        return this.studyForm.get('discountPercentage') as FormControl;
    }

    get grandTotalControl(): FormControl {
        return this.studyForm.get('grandTotal') as FormControl;
    }

    constructor(
        public dialogRef: MatDialogRef<CreateEditStudiesComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        private fb: FormBuilder
    ) {}

    ngOnInit() {
        this.createForm();
        this.setData();
    }

    createForm(): void {
        this.studyForm = this.fb.group({
            name: ['', Validators.required],
            alias: ['', Validators.required],
            price: ['', Validators.required],
            discountPercentage: [0],
            grandTotal: [{ value: '', disabled: true }, Validators.required],
            deliveryDays: ['', Validators.required],
            conditions: ['', Validators.required],
            notes: [''],
        });

        this.priceControl?.valueChanges.subscribe((value) => {
            const total = getGrandTotal(
                value,
                this.discountPercentageControl?.value
            );
            this.grandTotalControl?.setValue(total);
        });

        this.discountPercentageControl?.valueChanges.subscribe((value) => {
            const total = getGrandTotal(this.priceControl?.value, value);
            this.grandTotalControl?.setValue(total);
        });
    }

    setData(): void {
        // Edit mode
        if (this.data.itemData) {
            this.mode = 'edit';
            const data = this.data.itemData;
            const grandTotalValue =
                data.grandTotal ||
                getGrandTotal(data.price, data.discountPercentage);

            this.studyForm.patchValue({
                name: data.name,
                alias: data.alias,
                price: data.price,
                grandTotal: grandTotalValue,
                discountPercentage: data.discountPercentage,
                deliveryDays: data.deliveryDays,
                // Temporal data.recommendations, remove when latest changes arrive
                conditions: data.recommendations || data.conditions,
                notes: data.notes,
            });
        } else {
            this.mode = 'create';
        }
    }

    createUpdateItem(): void {
        const formValues = {
            ...this.studyForm.value,
        };
        this.dialogRef.close({ formValues, mode: this.mode });
    }
}

export interface DialogData {
    title: string;
    itemData: any;
}
