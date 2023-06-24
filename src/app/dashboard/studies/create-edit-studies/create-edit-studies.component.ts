import { Component, Inject, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { StudiesService } from 'src/app/services/studies.service';
import { getGrandTotal } from 'src/app/shared/utils/utils';
import { Study } from '../studies.component';

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
        private fb: FormBuilder,
        private studiesService: StudiesService
    ) {}

    ngOnInit() {
        this.createForm();
        this.setData();
    }

    createForm(): void {
        this.studyForm = this.fb.group({
            name: ['', Validators.required],
            alias: [''],
            price: ['', Validators.required],
            discountPercentage: [0],
            grandTotal: [{ value: '', disabled: true }, Validators.required],
            deliveryDays: [null, Validators.required],
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
                conditions: data.conditions,
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

        if (formValues && this.mode === 'create') {
            this.studiesService
                .createStudy(formValues)
                .subscribe((response: Study) => {
                    this.dialogRef.close({
                        formValues: response,
                        mode: this.mode,
                    });
                });
        } else if (formValues && this.mode === 'edit') {
            const newFormValues = {
                ...formValues,
                study_id: this.data.itemData?.study_id,
            };
            this.studiesService
                .updateStudy(newFormValues)
                .subscribe((response: Study) => {
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
