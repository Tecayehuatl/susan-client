import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Discount, DiscountsService } from 'src/app/services/discounts.service';
import { GenericModalComponent } from 'src/app/shared/components/generic-modal/generic-modal.component';
import { CreateEditDiscountsComponent } from './create-edit-discounts/create-edit-discounts.component';

@Component({
    selector: 'app-discounts',
    templateUrl: './discounts.component.html',
    styleUrls: ['./discounts.component.scss'],
})
export class DiscountsComponent implements OnInit, AfterViewInit {
    title = 'DESCUENTOS';
    displayedColumns: string[] = [
        'discount_id',
        'name',
        'discountPercentage',
        'isActive',
        'delete',
    ];
    dataSource!: MatTableDataSource<Discount>;

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(
        private dialog: MatDialog,
        private _snackBar: MatSnackBar,
        private discountsService: DiscountsService
    ) {}

    ngOnInit(): void {}

    ngAfterViewInit() {
        this.discountsService.getDiscounts().subscribe((data) => {
            // Assign the data to the data source for the table to render
            this.dataSource = new MatTableDataSource(data as Discount[]);
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

    openCreateEditDiscountDialog(itemData?: Discount, index?: any): void {
        const dialogRef = this.dialog.open(CreateEditDiscountsComponent, {
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
                    `Descuento: ${formValues.first_name} creado`,
                    'CERRAR'
                );
            } else if (formValues && mode === 'edit') {
                // Updating the local datasource
                const data = this.dataSource.data;
                const newDataSource = data.map((discount: Discount, i) => {
                    if (i === index) {
                        return formValues;
                    }
                    return discount;
                });
                this.dataSource.data = newDataSource;
                this._snackBar.open(
                    `Descuento: ${formValues.first_name} actualizado`,
                    'Cerrar'
                );
            }
        });
    }

    openDeleteDialog(item: Discount, event: Event, index: number): void {
        event.stopPropagation();

        const dialogRef = this.dialog.open(GenericModalComponent, {
            minWidth: '800px',
            data: {
                title: `¿SEGURO QUE DESEA ELIMINAR EL DESCUENTO "${item.name}"?`,
                actions: {
                    main: 'ELIMINAR DESCUENTO',
                    secondary: 'CANCELAR',
                },
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result === true) {
                this.discountsService
                    .deleteDiscount(item?.discount_id)
                    .subscribe(() => {
                        this.removeAt(index);
                        this._snackBar.open(
                            `Descuento: ${item.name} borrado`,
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
