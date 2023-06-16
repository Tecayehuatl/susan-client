import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CreateEditBranchOfficesComponent } from './create-edit-branch-offices/create-edit-branch-offices.component';
import { GenericModalComponent } from 'src/app/shared/components/generic-modal/generic-modal.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-branch-offices',
    templateUrl: './branch-offices.component.html',
    styleUrls: ['./branch-offices.component.scss'],
})
export class BranchOfficesComponent implements AfterViewInit {
    title = 'SUCURSALES';
    displayedColumns: string[] = [
        'branchOfficeName',
        'email',
        'phone1',
        'phone2',
        'address',
        'schedule',
        'delete',
    ];
    dataSource: MatTableDataSource<any>;

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(private dialog: MatDialog, private _snackBar: MatSnackBar) {
        // Create 100 users
        const users = Array.from({ length: 4 }, (_, k) => createNewUser(k + 1));

        // Assign the data to the data source for the table to render
        this.dataSource = new MatTableDataSource(users);
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    openCreateEditPatientDialog(itemData?: any): void {
        const dialogRef = this.dialog.open(CreateEditBranchOfficesComponent, {
            width: '1100px',
            minHeight: '500px',
            data: {
                itemData,
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            console.log(`Dialog result: ${result}`);
        });
    }

    openDeleteDialog(item: any, event: Event, index: number) {
        event.stopPropagation();

        const dialogRef = this.dialog.open(GenericModalComponent, {
            minWidth: '800px',
            data: {
                title: `¿SEGURO QUE DESEA ELIMINAR LAL SUCURSAL "${item.branchOfficeName}"?`,
                actions: {
                    main: 'ELIMINAR SUCURSAL',
                    secondary: 'CANCELAR',
                },
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result === true) {
                this.removeAt(index);

                this._snackBar.open(
                    `Sucursal: ${item.branchOfficeName} borrada`,
                    'CERRAR'
                );
            }
        });
    }

    removeAt(index: number) {
        const data = this.dataSource.data;
        data.splice(
            this.paginator.pageIndex * this.paginator.pageSize + index,
            1
        );
        this.dataSource.data = data;
    }
}

/** Builds and returns a new User. */
function createNewUser(id: number): any {
    return {
        branchOfficeName: 'Test',
        phone1: 2223233233,
        street: 'BERRIOZABAL',
        int_num: null,
        town: 'SAN MIGUEL XOXTLA',
        zipcode: 72620,
        state: 'PUEBLA',
        email: 'biotecsalab@hotmail.com',
        phone2: 2223233233,
        ext_num: '1027',
        city: 'PUEBLA',
        schedule: 'L-S 9:00AM - 06:00PM',
        colony: 'SAN MIGUEL XOXTLA',
        country: 'MX',
    };
}
