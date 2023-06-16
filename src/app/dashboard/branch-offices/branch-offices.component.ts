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
        const users = Array.from({ length: 100 }, (_, k) =>
            createNewUser(k + 1)
        );

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

    openDeleteDialog(item: any, event: any) {
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
            console.log(`Sucursal: ${item.branchOfficeName} borrada`);
            this._snackBar.open(
                `Sucursal: ${item.branchOfficeName} borrada`,
                'CERRAR',
                {
                    // horizontalPosition: 'center',
                    // verticalPosition: 'top',
                }
            );
        });
    }
}

const NAMES: string[] = [
    'Maia',
    'Asher',
    'Olivia',
    'Atticus',
    'Amelia',
    'Jack',
    'Charlotte',
    'Theodore',
    'Isla',
    'Oliver',
    'Isabella',
    'Jasper',
    'Cora',
    'Levi',
    'Violet',
    'Arthur',
    'Mia',
    'Thomas',
    'Elizabeth',
];

/** Builds and returns a new User. */
function createNewUser(id: number): any {
    const name =
        NAMES[Math.round(Math.random() * (NAMES.length - 1))] +
        ' ' +
        NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) +
        '.';

    return {
        id: id.toString(),
        branchOfficeName: name,
        email: 'biotecsalab@hotmail.com',
        phone1: '22-23-23-32-33',
        phone2: '22-23-23-32-33',
        street: 'BERRIOZABAL 1027 SAN MIGUEL XOXTLA 72620',
        schedule: 'L-S 9:00AM - 06:00PM',
        ext_num: '1027',
    };
}
