import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CreateEditPatientComponent } from './create-edit-patient/create-edit-patient.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PatientsService } from 'src/app/services/patients.service';
import { GenericModalComponent } from 'src/app/shared/components/generic-modal/generic-modal.component';
import { Router } from '@angular/router';

@Component({
    selector: 'app-patients',
    templateUrl: './patients.component.html',
    styleUrls: ['./patients.component.scss'],
})
export class PatientsComponent implements AfterViewInit {
    title = 'PACIENTES';
    displayedColumns: string[] = [
        'patient_id',
        'fullName',
        'date_birth',
        'age',
        'phone1',
        'phone2',
        'email',
        'edit',
        'delete',
    ];
    dataSource!: MatTableDataSource<Patient>;

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(
        private dialog: MatDialog,
        private _snackBar: MatSnackBar,
        private patientsService: PatientsService,
        private router: Router
    ) {}

    ngAfterViewInit() {
        this.patientsService.getPatients().subscribe((data) => {
            // Assign the data to the data source for the table to render
            this.dataSource = new MatTableDataSource(data as Patient[]);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
        });
    }

    applyFilter(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
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
}
