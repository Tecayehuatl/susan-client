import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Order } from 'src/app/services/orders-quotes.service';

@Component({
    selector: 'app-order-detail',
    templateUrl: './order-detail.component.html',
    styleUrls: ['./order-detail.component.scss'],
})
export class OrderDetailComponent implements AfterViewInit {
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

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }
}
