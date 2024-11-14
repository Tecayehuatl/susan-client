import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CreateEditPatientComponent } from './create-edit-patient/create-edit-patient.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PatientsService } from 'src/app/services/patients.service';
import { GenericModalComponent } from 'src/app/shared/components/generic-modal/generic-modal.component';
import { Router } from '@angular/router';
import { RoleService } from 'src/app/services/role.service';
import { AuthService, UserSystem } from 'src/app/services/auth.service';
import { UserRole } from '../users/create-edit-users/create-edit-users.component';

@Component({
    selector: 'app-patients',
    templateUrl: './patients.component.html',
    styleUrls: ['./patients.component.scss'],
})
export class PatientsComponent implements OnInit, AfterViewInit {
    title = 'PACIENTES';
    displayedColumns: string[] = [
        'numberElement',
        'patient_id',
        'created_at',
        'updated_at',
        'fullName',
        'date_birth',
        'age',
        'phone1',
        'phone2',
        'email',
        'edit',
        'delete',
    ];
    genders = [
        { name: 'Masculino', value: 'male' },
        { name: 'Femenino', value: 'female' },
    ];
    isPanelDisplayed = true;
    dataSource!: MatTableDataSource<Patient>;
    timer: any;
    searchForm!: FormGroup;
    userData!: UserSystem;
    userRoles: UserRole[] = [];
    requiredRoles: UserRole[] = [UserRole.SUPER, UserRole.ADMIN];

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(
        private fb: FormBuilder,
        private dialog: MatDialog,
        private _snackBar: MatSnackBar,
        private patientsService: PatientsService,
        public rolesService: RoleService,
        public authService: AuthService,
        private router: Router
    ) {
        this.userData = this.authService.userSystemData;
        this.userRoles = this.userData.roles as UserRole[];
    }

    ngOnInit(): void {
        this.searchForm = this.fb.group({
            first_name: '',
            middle_name: '',
            last_name: '',
            phone1: '',
            phone2: '',
            email: '',
            gender: '',
        });
    }

    ngAfterViewInit() {
        this.getPatients();
    }

    getPatients(): void {
        this.patientsService.getPatients().subscribe({
            next: ({ data }) => {
                // Assign the data to the data source for the table to render
                this.dataSource = new MatTableDataSource(data as Patient[]);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
            },
        });
    }

    searchPatients(): void {
        if (this.timer) {
            clearTimeout(this.timer);
        }

        this.timer = setTimeout(() => {
            const hasAnyFormInput = Object.keys(this.searchForm.value).find(
                (key) => this.searchForm.value[key]
            );

            // Call the original function with no 'search' parameter
            if (!hasAnyFormInput) {
                this.getPatients();
                return;
            }

            const queryObject: { [value: string]: string } = {};
            let queryObjectEncoded = '';

            Object.keys(this.searchForm.controls).map((controlName: string) => {
                if (this.searchForm.get(controlName)?.value) {
                    const controlValue =
                        this.searchForm.get(controlName)?.value;
                    queryObject[controlName] = controlValue.trim();
                }
            });
            queryObjectEncoded = encodeURIComponent(
                JSON.stringify(queryObject)
            );

            this.patientsService
                .searchPatients(queryObjectEncoded)
                .subscribe(({ data }) => {
                    this.dataSource.data = data;
                    if (this.dataSource.paginator) {
                        this.dataSource.paginator.firstPage();
                    }
                });
        }, 1000);
    }

    openCreateEditPatientDialog(
        itemData?: Patient,
        index?: any,
        type?: string,
        event?: Event
    ): void {
        event?.stopPropagation();
        // This will only navigate to the patient details
        if (type === 'single') {
            this.router.navigateByUrl(
                `/dashboard/patients/${itemData?.patient_id}`
            );
            return;
        }
        // The rest of the code is for create or edit a patient
        const dialogRef = this.dialog.open(CreateEditPatientComponent, {
            width: '1100px',
            minHeight: '500px',
            data: { itemData },
        });

        dialogRef.afterClosed().subscribe(({ formValues, mode }) => {
            if (formValues && mode === 'create') {
                // Updating the local datasource
                const newDataSource = this.dataSource.data;
                this.dataSource.data = [formValues, ...newDataSource];
                this._snackBar.open(
                    `PACIENTE: ${formValues.first_name} CREADA`,
                    'CERRAR'
                );
                const patient = formValues as Patient;
                this.openCreateEditPatientDialog(patient, null, 'single');
            } else if (formValues && mode === 'edit') {
                // Updating the local datasource
                const data = this.dataSource.data;
                const newDataSource = data.map((patient: Patient, i) => {
                    if (i === index) {
                        return formValues;
                    }
                    return patient;
                });
                this.dataSource.data = newDataSource;
                this._snackBar.open(
                    `PACIENTE: ${formValues.first_name} ACTUALIZADO`,
                    'CERRAR'
                );
            }
        });
    }

    openDeleteDialog(item: Patient, event: Event, index: number): void {
        event.stopPropagation();

        const dialogRef = this.dialog.open(GenericModalComponent, {
            minWidth: '800px',
            data: {
                title: `¿SEGURO QUE DESEA ELIMINAR AL PACIENTE "${item.first_name}"?`,
                actions: {
                    main: 'ELIMINAR PACIENTE',
                    secondary: 'CANCELAR',
                },
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result === true) {
                this.patientsService
                    .deletePatient(item.patient_id)
                    .subscribe(() => {
                        this.removeAt(index);
                        this._snackBar.open(
                            `Paciente: ${item.first_name} borrado`,
                            'CERRAR'
                        );
                    });
            }
        });
    }

    removeAt(index: number): void {
        const data = this.dataSource.data;
        data.splice(
            this.paginator.pageIndex * this.paginator.pageSize + index,
            1
        );
        this.dataSource.data = data;
    }
}

export interface Patient {
    patient_id: string;
    first_name: string;
    middle_name: string;
    last_name: string;
    date_birth: string;
    age: number;
    phone1: string;
    phone2: string;
    email: string;
    gender: string;
    created_at?: Date;
    updated_at?: Date;
}
