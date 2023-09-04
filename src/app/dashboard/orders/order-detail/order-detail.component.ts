import {
    AfterViewInit,
    Component,
    ComponentRef,
    OnInit,
    ViewChild,
    ViewContainerRef,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSidenav } from '@angular/material/sidenav';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Order } from 'src/app/services/orders-quotes.service';
import { NotesComponent } from 'src/app/shared/components/notes/notes.component';
import { PaymentHistoricalTransactionsComponent } from 'src/app/shared/components/payment-historical-transactions/payment-historical-transactions.component';
import { AdHostDirective } from 'src/app/shared/directives/ad-host.directive';

@Component({
    selector: 'app-order-detail',
    templateUrl: './order-detail.component.html',
    styleUrls: ['./order-detail.component.scss'],
})
export class OrderDetailComponent implements OnInit, AfterViewInit {
    orderId!: string;
    displayedColumns: string[] = [
        'id',
        'studyName',
        'alias',
        'deliveryDays',
        'price',
        'discount',
        'grandTotal',
    ];
    dataSource!: MatTableDataSource<any>;
    orderDetail: Order;
    isLoading = true;
    viewContainerRef!: ViewContainerRef;

    @ViewChild(AdHostDirective, { static: true }) adHost!: AdHostDirective;
    @ViewChild(MatSidenav) sidenav!: MatSidenav;
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(private route: ActivatedRoute) {
        this.orderId = this.route.snapshot.params['patientId'];

        // Assign the data to the data source for the table to render
        this.orderDetail = this.route.snapshot.data['orderDetail'];
        this.dataSource = new MatTableDataSource(
            this.orderDetail.order_studies
        );
    }

    ngOnInit(): void {}

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    renderDynamicComponent(type: string): void {
        this.viewContainerRef = this.adHost.viewContainerRef;
        this.viewContainerRef.clear();
        this.sidenav?.open().then(() => {
            this.isLoading = true;
            let componentInstance: ComponentRef<any>;

            switch (type) {
                case 'historicPayment':
                    console.log('Creating hisoric payment');
                    componentInstance = this.viewContainerRef.createComponent(
                        PaymentHistoricalTransactionsComponent
                    );
                    componentInstance.instance.title =
                        'Historial de pagos realizados';
                    this.isLoading = false;
                    componentInstance.onDestroy(() => {
                        this.isLoading = false;
                        this.viewContainerRef.clear();
                    });

                    break;
                case 'notes':
                    console.log('Creating notes');
                    componentInstance =
                        this.viewContainerRef.createComponent(NotesComponent);
                    componentInstance.instance.title = 'Notas';
                    componentInstance.instance.notes =
                        this.orderDetail.order_notes;

                    this.isLoading = false;
                    componentInstance.onDestroy(() => {
                        this.isLoading = false;
                        this.viewContainerRef.clear();
                    });

                    break;
                default:
                    this.isLoading = false;
                    this.viewContainerRef.clear();
                    this.sidenav.close();
                    break;
            }
        });
    }

    closeSidenav(): void {
        this.sidenav.close();
        this.viewContainerRef.clear();
    }
}
