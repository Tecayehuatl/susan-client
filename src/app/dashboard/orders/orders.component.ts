import {
    Component,
    EventEmitter,
    Input,
    Output,
    ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GenericModalComponent } from 'src/app/shared/components/generic-modal/generic-modal.component';
import {
    Order,
    OrdersQuotesService,
} from 'src/app/services/orders-quotes.service';

@Component({
    selector: 'app-orders',
    templateUrl: './orders.component.html',
    styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent {
    sortedOrdersQuotes!: Order[];

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
    @Input() title!: string;
    @Input() set incomingOrdersQuotes(ordersQuotes: Order[]) {
        // Initial sort and resort every time that this input changes
        this.sortedOrdersQuotes = this.sortData(
            {
                active: 'creationDate',
                direction: 'desc',
            } as Sort,
            ordersQuotes
        );
        this.dataSource.data = this.sortedOrdersQuotes;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }
    @Output() setNewincomingOrdersQuotes: EventEmitter<Order> =
        new EventEmitter<Order>();

    dataSource: MatTableDataSource<any> = new MatTableDataSource(
        this.sortedOrdersQuotes
    );
    displayedColumns: string[] = [
        'id',
        'creationDate',
        'generalStatus',
        'paymentStatus',
        'deliverStatus',
        'grandTotal',
        // TODO: remove balance and make it dinamyc when is a quote
        'balance',
        'delete',
    ];

    constructor(
        private _snackBar: MatSnackBar,
        private dialog: MatDialog,
        private orderQuoteService: OrdersQuotesService,
        private route: ActivatedRoute,
        private router: Router
    ) {}

    navigateToOrderQuote(order: Order): void {
        const patiendId = this.route.snapshot.params['patientId'];
        this.router.navigateByUrl(
            `/dashboard/patients/${patiendId}/${order?.order_id}`
        );
    }

    openDeleteDialog(orderId: string, event: Event, index: number): void {
        event.stopPropagation();

        const dialogRef = this.dialog.open(GenericModalComponent, {
            minWidth: '800px',
            data: {
                title: `¿SEGURO QUE DESEA ELIMINAR LA ORDEN"?`,
                actions: {
                    main: 'ELIMINAR ORDEN',
                    secondary: 'CANCELAR',
                },
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result === true) {
                this.removeAt(index);
                // this.orderQuoteService.deleteOrder(orderId).subscribe(() => {
                //     this.removeAt(index);
                //     this._snackBar.open(`ORDEN BORRADA`, 'CERRAR');
                // });
            }
        });
    }

    removeAt(index: number): void {
        const currentTableDataSource = this.dataSource.data;

        const elementoEliminado = currentTableDataSource.splice(
            this.paginator.pageIndex * this.paginator.pageSize + index,
            1
        )[0];

        this.dataSource.data = currentTableDataSource;
        // Notifying to the parent that one item has been removed
        this.setNewincomingOrdersQuotes.emit(elementoEliminado);
    }

    sortDataEvent(sort: Sort): void {
        this.dataSource.data = this.sortData(sort, this.sortedOrdersQuotes);
    }

    sortData(sort: Sort, orderQuotes: Order[]): Order[] {
        let ordersSorted: Order[] = [];

        const data = orderQuotes.slice();
        if (!sort.active || sort.direction === '') {
            ordersSorted = data;
            return ordersSorted;
        }

        ordersSorted = data.sort((a: any, b: any) => {
            const isAsc = sort.direction === 'asc';
            switch (sort.active) {
                case 'id':
                    return this.compare(a.order_id, b.order_id, isAsc);
                case 'creationDate':
                    return this.compare(a.created_at, b.created_at, isAsc);
                case 'generalStatus':
                    return this.compare(
                        a.order_status_id,
                        b.order_status_id,
                        isAsc
                    );
                case 'paymentStatus':
                    return this.compare(
                        a.payment_status_id,
                        b.payment_status_id,
                        isAsc
                    );
                case 'deliverStatus':
                    return this.compare(
                        a.delivery_status_id,
                        b.delivery_status_id,
                        isAsc
                    );
                case 'grandTotal':
                    return this.compare(a.grand_total, b.grand_total, isAsc);
                case 'balance':
                    return this.compare(a.balance, b.balance, isAsc);
                default:
                    return 0;
            }
        });

        return ordersSorted;
    }

    compare(a: number | string, b: number | string, isAsc: boolean) {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }
}
