import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-create-edit-doctors',
    templateUrl: './create-edit-doctors.component.html',
    styleUrls: ['./create-edit-doctors.component.scss'],
})
export class CreateEditDoctorsComponent implements OnInit {
    mode!: 'create' | 'edit';
    title!: string;
    doctorsForm!: FormGroup;

    constructor(
        public dialogRef: MatDialogRef<CreateEditDoctorsComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        private fb: FormBuilder
    ) {}

    ngOnInit() {
        this.createForm();
        this.setData();
    }

    createForm(): void {
        this.doctorsForm = this.fb.group({
            first_name: ['', Validators.required],
            middle_name: [''],
            last_name: [''],
            phone1: '',
            phone2: [''],
            cedula: ['', [Validators.maxLength(15)]],
            email: ['', [Validators.email]],
        });
    }

    setData(): void {
        // Edit mode
        if (this.data.itemData) {
            this.mode = 'edit';
            const data = this.data.itemData;

            this.doctorsForm.patchValue({
                first_name: data.first_name,
                middle_name: data.middle_name,
                last_name: data.last_name,
                phone1: data.phone1,
                phone2: data.phone2,
                cedula: data.cedula,
                email: data.email,
            });

        } else {
            this.mode = 'create';
        }
    }

    createUpdateItem(): void {
        const formValues = {
            ...this.doctorsForm.value,
        };
        this.dialogRef.close({ formValues, mode: this.mode });
    }
}

export interface DialogData {
    title: string;
    itemData: any;
}
