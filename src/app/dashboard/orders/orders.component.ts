import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
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
export class OrdersComponent implements AfterViewInit {
    @Input() title!: string;
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

    constructor(private route: ActivatedRoute, private router: Router) {
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

    navigateToOrderQuote(itemData?: Patient): void {
        const patiendId = this.route.snapshot.params['patientId'];
        this.router.navigateByUrl(
            `/dashboard/patients/${patiendId}/${itemData?.patient_id}`
        );
    }
}

/** Constants used to fill up our data base. */
const FRUITS: string[] = [
    'blueberry',
    'lychee',
    'kiwi',
    'mango',
    'peach',
    'lime',
    'pomegranate',
    'pineapple',
];
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
function createNewUser(id: number) {
    const name =
        NAMES[Math.round(Math.random() * (NAMES.length - 1))] +
        ' ' +
        NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) +
        '.';

    return {
        patient_id: id.toString(),
        creationDate: 'Sep 11 2023',
        generalStatus: 'EN CURSO',
        paymentStatus: 'PENDIENTE',
        deliverStatus: 'NO ENTREGADO',
        grandTotal: '100.00',
    };
}
