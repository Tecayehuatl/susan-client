import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { states } from 'src/app/shared/states';
import { towns } from 'src/app/shared/towns';

@Component({
    selector: 'app-create-edit-branch-offices',
    templateUrl: './create-edit-branch-offices.component.html',
    styleUrls: ['./create-edit-branch-offices.component.scss'],
})
export class CreateEditBranchOfficesComponent implements OnInit {
    states: any[];
    towns!: string[];
    countries: any[];
    mode!: 'create' | 'edit';
    title!: string;
    branchOfficeForm!: FormGroup;

    constructor(
        public dialogRef: MatDialogRef<CreateEditBranchOfficesComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        private fb: FormBuilder
    ) {
        this.countries = [{ value: 'MX', name: 'MÉXICO' }];
        this.states = states;
    }

    ngOnInit() {
        this.createForm();
        this.setData();
    }

    createForm(): void {
        this.branchOfficeForm = this.fb.group({
            name: ['', Validators.required],
            phone1: [null],
            street: ['', Validators.required],
            int_num: '',
            town: ['', Validators.required],
            zipcode: [null, Validators.required],
            state: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            phone2: [null],
            ext_num: ['', Validators.required],
            city: ['', Validators.required],
            schedule: ['', Validators.required],
            colony: '',
            // This value is assigned by default, we are only supporting México
            country: [{ value: 'MX', disabled: true }, Validators.required],
        });
    }

    setData(): void {
        // Edit mode
        if (this.data.itemData) {
            this.mode = 'edit';
            const data = this.data.itemData;

            this.branchOfficeForm.patchValue({
                name: data.name,
                phone1: data.phone1,
                street: data.street,
                int_num: data.int_num,
                zipcode: data.zipcode,
                state: data.state,
                email: data.email,
                phone2: data.phone2,
                ext_num: data.ext_num,
                city: data.city,
                schedule: data.schedule,
                colony: data.colony,
            });

            this.loadTowns(data.state);
            this.setTown(data.town?.toUpperCase());
        } else {
            this.mode = 'create';
            this.loadTowns();
        }
    }

    loadTowns(state?: string): void {
        // Sets ALL towns if a state is coming from the database
        if (state) {
            this.towns = towns[state as keyof typeof towns];
        } else {
            // Going to load towns every time the user changes the state value or if is a creation record
            this.branchOfficeForm
                .get('state')
                ?.valueChanges.subscribe((stateValue: string) => {
                    this.towns = towns[stateValue as keyof typeof towns];
                });
        }
    }

    setTown(town: string): void {
        this.branchOfficeForm.get('town')?.patchValue(town);
    }

    createUpdateItem(): void {
        const formValues = {
            ...this.branchOfficeForm.value,
            country: this.branchOfficeForm.get('country')?.value,
        };
        this.dialogRef.close({ formValues, mode: this.mode });
    }
}

export interface DialogData {
    title: string;
    itemData: any;
}
