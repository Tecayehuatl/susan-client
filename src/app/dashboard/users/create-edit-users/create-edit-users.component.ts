import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UsersService } from 'src/app/services/users.service';
import { User } from '../users.component';
import { BranchOffice } from '../../branch-offices/branch-offices.component';

@Component({
    selector: 'app-create-edit-users',
    templateUrl: './create-edit-users.component.html',
    styleUrls: ['./create-edit-users.component.scss'],
})
export class CreateEditUsersComponent implements OnInit {
    mode!: 'create' | 'edit';
    title!: string;
    userForm!: FormGroup;
    minDate!: Date;
    maxDate!: Date;
    userRoles = UserRole;

    constructor(
        public dialogRef: MatDialogRef<CreateEditUsersComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        private fb: FormBuilder,
        private usersService: UsersService
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
        this.userForm = this.fb.group({
            branch_office_id: [null, Validators.required],
            first_name: ['', Validators.required],
            middle_name: ['', Validators.required],
            last_name: ['', Validators.required],
            phone1: [''],
            phone2: [''],
            email: ['', [Validators.required]],
            password: [''],
            date_birth: ['', Validators.required],
            is_active: [true],
            roles: [[], Validators.required],
        });
    }

    setData(): void {
        // Edit mode
        if (this.data.itemData) {
            this.mode = 'edit';
            const data = this.data.itemData;

            this.userForm.patchValue({
                branch_office_id: data.branch_office_id,
                first_name: data.first_name,
                middle_name: data.middle_name,
                last_name: data.last_name,
                phone1: data.phone1,
                phone2: data.phone2,
                email: data.email,
                date_birth: data.date_birth,
                is_active: data.is_active,
                roles: data.active_roles,
            });
        } else {
            this.mode = 'create';
        }
    }

    createUpdateItem(): void {
        const formValues = {
            ...this.userForm.value,
        };

        if (formValues && this.mode === 'create') {
            this.usersService
                .createUser(formValues)
                .subscribe((response: User) => {
                    this.dialogRef.close({
                        formValues: response,
                        mode: this.mode,
                    });
                });
        } else if (formValues && this.mode === 'edit') {
            const newFormValues = {
                ...formValues,
                user_id: this.data.itemData?.user_id,
            };
            this.usersService
                .updateUser(newFormValues)
                .subscribe((response: User) => {
                    this.dialogRef.close({
                        formValues: response,
                        mode: this.mode,
                    });
                });
        }
    }
}

export enum UserRole {
    SUPER = 'super',
    ADMIN = 'admin',
    OPERATOR = 'operator',
    CASHIER = 'cashier',
    VIEWER = 'viewer',
}

export interface DialogData {
    title: string;
    itemData: any;
    branchOffices: BranchOffice[];
}
