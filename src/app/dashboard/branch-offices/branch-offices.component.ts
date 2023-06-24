import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CreateEditBranchOfficesComponent } from './create-edit-branch-offices/create-edit-branch-offices.component';
import { GenericModalComponent } from 'src/app/shared/components/generic-modal/generic-modal.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BranchOfficesService } from 'src/app/services/branch-offices.service';

@Component({
    selector: 'app-branch-offices',
    templateUrl: './branch-offices.component.html',
    styleUrls: ['./branch-offices.component.scss'],
})
export class BranchOfficesComponent implements AfterViewInit {
    title = 'SUCURSALES';
    displayedColumns: string[] = [
        'id',
        'name',
        'email',
        'phone1',
        'phone2',
        'address',
        'schedule',
        'delete',
    ];
    dataSource!: MatTableDataSource<BranchOffice>;

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(
        private dialog: MatDialog,
        private _snackBar: MatSnackBar,
        private branchOfficesService: BranchOfficesService,
    ) {}

    ngAfterViewInit() {
        this.branchOfficesService.getBranchOffices().subscribe((data) => {
            // Assign the data to the data source for the table to render
            this.dataSource = new MatTableDataSource(data as BranchOffice[]);
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

    openCreateEditPatientDialog(itemData?: BranchOffice, index?: any): void {
        const dialogRef = this.dialog.open(CreateEditBranchOfficesComponent, {
            width: '1100px',
            minHeight: '500px',
            data: { itemData },
        });

        dialogRef.afterClosed().subscribe(({ responseForm, mode }) => {
            if (responseForm && mode === 'create') {
                // Updating the local datasource
                const newDataSource = this.dataSource.data;
                this.dataSource.data = [responseForm, ...newDataSource];
                this._snackBar.open(
                    `SUCURSAL: ${responseForm.name} CREADA`,
                    'CERRAR'
                );
            } else if (responseForm && mode === 'edit') {
                // Updating the local datasource
                const data = this.dataSource.data;
                const newDataSource = data.map(
                    (branchOffice: BranchOffice, i) => {
                        if (i === index) {
                            return responseForm;
                        }
                        return branchOffice;
                    }
                );

                this.dataSource.data = newDataSource;
                this._snackBar.open(
                    `SUCURSAL: ${responseForm.name} ACTUALIZADA`,
                    'CERRAR'
                );
            }
        });
    }

    openDeleteDialog(item: BranchOffice, event: Event, index: number): void {
        event.stopPropagation();

        const dialogRef = this.dialog.open(GenericModalComponent, {
            minWidth: '800px',
            data: {
                title: `¿SEGURO QUE DESEA ELIMINAR LAL SUCURSAL "${item.name}"?`,
                actions: {
                    main: 'ELIMINAR SUCURSAL',
                    secondary: 'CANCELAR',
                },
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result === true) {
                this.branchOfficesService
                    .deleteBranchOffice(item.branch_office_id)
                    .subscribe(() => {
                        this.removeAt(index);
                        this._snackBar.open(
                            `Sucursal: ${item.name} borrada`,
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

export interface BranchOffice {
    branch_office_id: string;
    name: string;
    phone1: string;
    street: string;
    int_num: string;
    town: string;
    zipcode: string;
    state: string;
    email: string;
    phone2: string;
    ext_num: string;
    city: string;
    schedule: string;
    colony: string;
    country: string;
}
