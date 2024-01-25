import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { StudiesService } from 'src/app/services/studies.service';
import { CreateEditStudiesComponent } from './create-edit-studies/create-edit-studies.component';
import { GenericModalComponent } from 'src/app/shared/components/generic-modal/generic-modal.component';

@Component({
    selector: 'app-studies',
    templateUrl: './studies.component.html',
    styleUrls: ['./studies.component.scss'],
})
export class StudiesComponent implements AfterViewInit {
    title = 'ESTUDIOS';
    displayedColumns: string[] = [
        'study_id',
        'name',
        'alias',
        'price',
        'grandTotal',
        'discountPercentage',
        'deliveryDays',
        'conditions',
        'notes',
        'delete',
    ];
    dataSource!: MatTableDataSource<Study>;
    timer: any;

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(
        private dialog: MatDialog,
        private _snackBar: MatSnackBar,
        private studiesService: StudiesService
    ) {}

    ngAfterViewInit() {
        this.studiesService.getStudies().subscribe((data) => {
            // Assign the data to the data source for the table to render
            this.dataSource = new MatTableDataSource(data as Study[]);
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

    searchPatients(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value;
        const searchKey = filterValue.trim().toLowerCase();

        if (this.timer) {
            clearTimeout(this.timer);
        }

        this.timer = setTimeout(() => {
            this.studiesService.searchStudies(searchKey).subscribe((data) => {
                this.dataSource.data = data;
                if (this.dataSource.paginator) {
                    this.dataSource.paginator.firstPage();
                }
            });
        }, 1000);
    }

    openCreateEditStudyDialog(itemData?: Study, index?: any): void {
        const dialogRef = this.dialog.open(CreateEditStudiesComponent, {
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
                    `ESTUDIO: ${formValues.name} CREADO`,
                    'CERRAR'
                );
            } else if (formValues && mode === 'edit') {
                // Updating the local datasource
                const data = this.dataSource.data;
                const newDataSource = data.map((study: Study, i) => {
                    if (i === index) {
                        return formValues;
                    }
                    return study;
                });

                this.dataSource.data = newDataSource;
                this._snackBar.open(
                    `ESTUDIO: ${formValues.name} ACTUALIZADO`,
                    'CERRAR'
                );
            }
        });
    }

    openDeleteDialog(item: Study, event: Event, index: number): void {
        event.stopPropagation();

        const dialogRef = this.dialog.open(GenericModalComponent, {
            minWidth: '800px',
            data: {
                title: `¿SEGURO QUE DESEA ELIMINAR EL ESTUDIO "${item.name}"?`,
                actions: {
                    main: 'ELIMINAR ESTUDIO',
                    secondary: 'CANCELAR',
                },
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result === true) {
                this.studiesService.deleteStudy(item.study_id).subscribe(() => {
                    this.removeAt(index);
                    this._snackBar.open(
                        `Estudio: ${item.name} borrado`,
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

export interface Study {
    study_id: string;
    name: string;
    alias: string;
    price: number;
    grandTotal: number;
    discountPercentage: number;
    progressStatus: boolean;
    deliveryDays: number;
    conditions: string;
    notes: string;
}
