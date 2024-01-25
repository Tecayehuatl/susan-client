import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { GenericModalComponent } from 'src/app/shared/components/generic-modal/generic-modal.component';
import { Observable } from 'rxjs';
import { DoctorsService } from 'src/app/services/doctors.service';
import { CreateEditDoctorsComponent } from './create-edit-doctors/create-edit-doctors.component';

@Component({
    selector: 'app-doctors',
    templateUrl: './doctors.component.html',
    styleUrls: ['./doctors.component.scss'],
})
export class DoctorsComponent implements AfterViewInit {
    title = 'DOCTORES';
    displayedColumns: string[] = [
        'doctor_id',
        'first_name',
        'middle_name',
        'last_name',
        'phone1',
        'phone2',
        'cedula',
        'email',
        'delete',
    ];
    dataSource!: MatTableDataSource<Doctor>;

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(
        private dialog: MatDialog,
        private _snackBar: MatSnackBar,
        private doctorsService: DoctorsService
    ) {}

    ngAfterViewInit() {
        this.doctorsService.getDoctors().subscribe((data) => {
            // Assign the data to the data source for the table to render
            this.dataSource = new MatTableDataSource(data as Doctor[]);
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

    openCreateEditDoctorDialog(itemData?: Doctor, index?: any): void {
        const dialogRef = this.dialog.open(CreateEditDoctorsComponent, {
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
                    `DOCTOR: ${formValues.first_name} CREADA`,
                    'CERRAR'
                );
            } else if (formValues && mode === 'edit') {
                // Updating the local datasource
                const data = this.dataSource.data;
                const newDataSource = data.map((doctor: Doctor, i) => {
                    if (i === index) {
                        return formValues;
                    }
                    return doctor;
                });
                this.dataSource.data = newDataSource;
                this._snackBar.open(
                    `DOCTOR: ${formValues.first_name} ACTUALIZADO`,
                    'CERRAR'
                );
            }
        });
    }

    openDeleteDialog(item: Doctor, event: Event, index: number): void {
        event.stopPropagation();

        const dialogRef = this.dialog.open(GenericModalComponent, {
            minWidth: '800px',
            data: {
                title: `¿SEGURO QUE DESEA ELIMINAR AL DOCTOR "${item.first_name}"?`,
                actions: {
                    main: 'ELIMINAR DOCTOR',
                    secondary: 'CANCELAR',
                },
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result === true) {
                this.doctorsService
                    .deleteDoctor(item.doctor_id)
                    .subscribe(() => {
                        this.removeAt(index);
                        this._snackBar.open(
                            `Doctor: ${item.first_name} borrado`,
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

export interface Doctor {
    doctor_id: string;
    first_name: string;
    middle_name: string;
    last_name: string;
    phone1: string;
    phone2: string;
    cedula: string;
    email: string;
}
