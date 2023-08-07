import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Patient } from '../patients/patients.component';

@Component({
    selector: 'app-orders',
    templateUrl: './orders.component.html',
    styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit {
    @Input() title!: string;
    @Input() ordersQuotes!: any[];
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    dataSource!: MatTableDataSource<any>;
    displayedColumns: string[] = [
        'id',
        'creationDate',
        'generalStatus',
        'paymentStatus',
        'deliverStatus',
        'grandTotal',
    ];

    constructor(private route: ActivatedRoute, private router: Router) {}

    ngOnInit(): void {
        this.dataSource = new MatTableDataSource(this.ordersQuotes);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    navigateToOrderQuote(itemData?: any): void {
        const patiendId = this.route.snapshot.params['patientId'];
        this.router.navigateByUrl(
            `/dashboard/patients/${patiendId}/${itemData?.order_id}`
        );
    }
}
