import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Doctor } from '../doctors.component';
import { DoctorsService } from 'src/app/services/doctors.service';

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
        private fb: FormBuilder,
        private doctorsService: DoctorsService
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
            email: [''],
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

        if (formValues && this.mode === 'create') {
            this.doctorsService
                .createDoctor(formValues)
                .subscribe((response: Doctor) => {
                    this.dialogRef.close({
                        formValues: response,
                        mode: this.mode,
                    });
                });
        } else if (formValues && this.mode === 'edit') {
            const newFormValues = {
                ...formValues,
                doctor_id: this.data.itemData?.doctor_id,
            };
            this.doctorsService
                .updateDoctor(newFormValues)
                .subscribe((response: Doctor) => {
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
