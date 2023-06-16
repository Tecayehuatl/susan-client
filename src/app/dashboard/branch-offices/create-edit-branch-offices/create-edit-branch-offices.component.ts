import { AfterViewInit, Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { states } from 'src/app/shared/states';

@Component({
    selector: 'app-create-edit-branch-offices',
    templateUrl: './create-edit-branch-offices.component.html',
    styleUrls: ['./create-edit-branch-offices.component.scss'],
})
export class CreateEditBranchOfficesComponent implements OnInit, AfterViewInit {
    states: any[];
    countries: any[];
    mode!: 'create' | 'edit';
    title!: string;
    branchOfficeForm!: FormGroup;

    constructor(
        public dialogRef: MatDialogRef<CreateEditBranchOfficesComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        private fb: FormBuilder
    ) {
        this.states = states;
        this.countries = [{ value: 'MX', name: 'MÉXICO' }];
    }

    ngOnInit() {
        this.createForm();
        this.setData();
    }

    ngAfterViewInit(): void {}

    setData() {
        if (this.data.itemData) {
            this.mode = 'edit';
            const data = this.data.itemData;

            this.branchOfficeForm.patchValue({
                branchOfficeName: data.branchOfficeName,
                phone1: data.phone1,
                street: data.street,
                int_num: data.int_num,
                town: data.town,
                zipcode: data.zipcode,
                state: data.state,
                email: data.email,
                phone2: data.phone2,
                ext_num: data.ext_num,
                city: data.city,
                schedule: data.schedule,
                colony: data.colony,
                country: data.country,
            });

            this.branchOfficeForm.updateValueAndValidity();
        }
    }

    createForm() {
        this.branchOfficeForm = this.fb.group({
            branchOfficeName: ['', Validators.required],
            phone1: null,
            street: ['', Validators.required],
            int_num: '',
            town: ['', Validators.required],
            zipcode: [null, Validators.required],
            state: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            phone2: '',
            ext_num: ['', Validators.required],
            city: ['', Validators.required],
            schedule: ['', Validators.required],
            colony: '',
            country: ['', Validators.required],
        });
    }
}

export interface DialogData {
    title: string;
    itemData: any;
}
