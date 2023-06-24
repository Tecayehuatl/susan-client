import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PatientsService } from 'src/app/services/patients.service';
import { Patient } from '../patients.component';

@Component({
    selector: 'app-create-edit-patient',
    templateUrl: './create-edit-patient.component.html',
    styleUrls: ['./create-edit-patient.component.scss'],
})
export class CreateEditPatientComponent implements OnInit {
    mode!: 'create' | 'edit';
    title!: string;
    patientForm!: FormGroup;
    minDate!: Date;
    maxDate!: Date;
    genders = [
        { name: 'Masculino', value: 'male' },
        { name: 'Femenino', value: 'female' },
    ];

    constructor(
        public dialogRef: MatDialogRef<CreateEditPatientComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        private fb: FormBuilder,
        private patientService: PatientsService
    ) {
        const currentYear = new Date().getFullYear();
        this.minDate = new Date(currentYear - 110, 0, 1);
        this.maxDate = new Date(currentYear, 11, 31);
    }

    ngOnInit() {
        this.createForm();
        this.setData();
    }

    createForm(): void {
        this.patientForm = this.fb.group({
            first_name: ['', [Validators.required]],
            middle_name: ['', [Validators.required]],
            last_name: [''],
            date_birth: ['', [Validators.required]],
            phone1: [''],
            phone2: [''],
            email: [''],
            gender: ['', [Validators.required]],
        });
    }

    setData(): void {
        // Edit mode
        if (this.data.itemData) {
            this.mode = 'edit';
            const data = this.data.itemData;

            this.patientForm.patchValue({
                first_name: data.first_name,
                middle_name: data.middle_name,
                last_name: data.last_name,
                date_birth: data.date_birth,
                phone1: data.phone1,
                phone2: data.phone2,
                email: data.email,
                gender: data.gender,
            });
        } else {
            this.mode = 'create';
        }
    }

    createUpdateItem(): void {
        const formValues = {
            ...this.patientForm.value,
        };

        if (formValues && this.mode === 'create') {
            this.patientService
                .createPatient(formValues)
                .subscribe((response: Patient) => {
                    this.dialogRef.close({
                        formValues: response,
                        mode: this.mode,
                    });
                });
        } else if (formValues && this.mode === 'edit') {
            const newFormValues = {
                ...formValues,
                patient_id: this.data.itemData?.patient_id,
            };
            this.patientService
                .updatePatient(newFormValues)
                .subscribe((response: Patient) => {
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
