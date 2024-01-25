import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UsersService } from 'src/app/services/users.service';
import { CreateEditUsersComponent } from './create-edit-users/create-edit-users.component';
import { GenericModalComponent } from 'src/app/shared/components/generic-modal/generic-modal.component';
import { BranchOffice } from '../branch-offices/branch-offices.component';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements AfterViewInit {
    title = 'USUARIOS';
    displayedColumns: string[] = [
        'user_id',
        'first_name',
        'middle_name',
        'last_name',
        'phone1',
        'phone2',
        'email',
        'date_birth',
        'is_active',
        'delete',
    ];
    dataSource!: MatTableDataSource<User>;
    branchOffices!: BranchOffice[];
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(
        private dialog: MatDialog,
        private _snackBar: MatSnackBar,
        private usersService: UsersService,
        private route: ActivatedRoute
    ) {
        this.branchOffices = this.route.snapshot.data['branchOffices'];
    }

    ngAfterViewInit() {
        this.usersService.getUsers().subscribe((data: User[]) => {
            // Assign the data to the data source for the table to render
            this.dataSource = new MatTableDataSource(data as User[]);
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

    openCreateEditUserDialog(itemData?: User, index?: any): void {
        const dialogRef = this.dialog.open(CreateEditUsersComponent, {
            width: '1100px',
            minHeight: '500px',
            data: { itemData, branchOffices: this.branchOffices },
        });

        dialogRef.afterClosed().subscribe(({ formValues, mode }) => {
            if (formValues && mode === 'create') {
                // Updating the local datasource
                const newDataSource = this.dataSource.data;
                this.dataSource.data = [formValues, ...newDataSource];
                this._snackBar.open(
                    `USUARIO: ${formValues.first_name} CREADO`,
                    'CERRAR'
                );
            } else if (formValues && mode === 'edit') {
                // Updating the local datasource
                const data = this.dataSource.data;
                const newDataSource = data.map((user: User, i) => {
                    if (i === index) {
                        return formValues;
                    }
                    return user;
                });
                this.dataSource.data = newDataSource;
                this._snackBar.open(
                    `USUARIO: ${formValues.first_name} ACTUALIZADO`,
                    'CERRAR'
                );
            }
        });
    }

    openDeleteDialog(item: User, event: Event, index: number): void {
        event.stopPropagation();

        const dialogRef = this.dialog.open(GenericModalComponent, {
            minWidth: '800px',
            data: {
                title: `¿SEGURO QUE DESEA ELIMINAR AL USUARIO: "${item.first_name}"?`,
                actions: {
                    main: 'ELIMINAR USUARIO',
                    secondary: 'CANCELAR',
                },
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result === true) {
                this.usersService
                    .deleteUser(item.user_id.toString())
                    .subscribe(() => {
                        this.removeAt(index);
                        this._snackBar.open(
                            `USUARIO: ${item.first_name} ELIMINADO`,
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

export interface User {
    user_id: number;
    branch_office_id: number;
    first_name: string;
    middle_name: string;
    last_name: string;
    phone1: string;
    phone2: string;
    email: string;
    date_birth: string;
    password: string;
    is_active: boolean;
}
