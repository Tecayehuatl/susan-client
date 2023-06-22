import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-create-edit-studies',
    templateUrl: './create-edit-studies.component.html',
    styleUrls: ['./create-edit-studies.component.scss'],
})
export class CreateEditStudiesComponent implements OnInit {
    mode!: 'create' | 'edit';
    title!: string;
    studyForm!: FormGroup;

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
            discountPercentage: [''],
            grandTotal: [{ value: '', disabled: true }, Validators.required],
            deliveryDays: ['', Validators.required],
            conditions: ['', Validators.required],
            notes: [''],
        });
    }

    setData(): void {
        // Edit mode
        if (this.data.itemData) {
            this.mode = 'edit';
            const data = this.data.itemData;

            this.studyForm.patchValue({
                name: data.name,
                alias: data.alias,
                price: data.price,
                grandTotal: data.grandTotal,
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

    updatePrice(price: number, porcentage: number): number {

        return 0;
    }
}

export interface DialogData {
    title: string;
    itemData: any;
}
