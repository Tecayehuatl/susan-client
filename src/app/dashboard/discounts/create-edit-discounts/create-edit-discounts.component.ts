import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Discount, DiscountsService } from 'src/app/services/discounts.service';

@Component({
    selector: 'app-create-edit-discounts',
    templateUrl: './create-edit-discounts.component.html',
    styleUrls: ['./create-edit-discounts.component.scss'],
})
export class CreateEditDiscountsComponent implements OnInit {
    mode!: 'create' | 'edit';
    title!: string;
    discountsForm!: FormGroup;

    constructor(
        public dialogRef: MatDialogRef<CreateEditDiscountsComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        private fb: FormBuilder,
        private discountsService: DiscountsService
    ) {}

    ngOnInit() {
        this.createForm();
        this.setData();
    }

    createForm(): void {
        this.discountsForm = this.fb.group({
            discount_id: [''],
            name: [''],
            discountPercentage: [],
            isActive: true,
        });
    }

    setData(): void {
        // Edit mode
        if (this.data?.itemData) {
            this.mode = 'edit';
            const data = this.data.itemData;

            this.discountsForm.patchValue({
                discount_id: data.discount_id,
                name: data.name,
                discountPercentage: data.discountPercentage,
                isActive: data.isActive,
            });
        } else {
            this.mode = 'create';
        }
    }

    createUpdateItem(): void {
        const formValues = {
            ...this.discountsForm.value,
        };

        if (formValues && this.mode === 'create') {
            delete formValues.discount_id;

            this.discountsService
                .createDiscount(formValues)
                .subscribe((response: Discount) => {
                    this.dialogRef.close({
                        formValues: response,
                        mode: this.mode,
                    });
                });
        } else if (formValues && this.mode === 'edit') {
            const newFormValues = {
                ...formValues,
                discount_id: this.data.itemData?.discount_id,
            };
            this.discountsService
                .updateDiscount(newFormValues)
                .subscribe((response: Discount) => {
                    this.dialogRef.close({
                        formValues: response,
                        mode: this.mode,
                    });
                });
        }
    }
}

export interface DialogData {
    title: string;
    itemData: any;
}
