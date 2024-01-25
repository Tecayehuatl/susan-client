import {
    AfterViewInit,
    Component,
    ComponentRef,
    OnInit,
    ViewChild,
    ViewContainerRef,
} from '@angular/core';
import {
    FormArray,
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSidenav } from '@angular/material/sidenav';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import {
    Order,
    OrdersQuotesService,
} from 'src/app/services/orders-quotes.service';
import { Discount } from 'src/app/services/discounts.service';
import { GenericModalComponent } from 'src/app/shared/components/generic-modal/generic-modal.component';
import { PatientsService } from 'src/app/services/patients.service';
import { Study } from '../../studies/studies.component';
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
        'changeStudyStatus',
    ];
    dataSource!: MatTableDataSource<any>;
    orderDetail: Order;
    discounts: Discount[];
    isLoading = true;
    viewContainerRef!: ViewContainerRef;
    studiesFormArray!: FormArray;
    discountsFormArray!: FormArray;

    @ViewChild(AdHostDirective, { static: true }) adHost!: AdHostDirective;
    @ViewChild(MatSidenav) sidenav!: MatSidenav;
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(
        private _fb: FormBuilder,
        private _snackBar: MatSnackBar,
        private dialog: MatDialog,
        private route: ActivatedRoute,
        private orderQuoteService: OrdersQuotesService,
        private patientService: PatientsService
    ) {
        this.orderId = this.route.snapshot.params['patientId'];

        // Assign the data to the data source for the table to render
        this.orderDetail = this.route.snapshot.data['orderDetail'];
        this.discounts = this.route.snapshot.data['discounts'];

        this.studiesFormArray = this.transformStudiesInFormArray(
            this.orderDetail.order_studies || []
        );

        this.dataSource = new MatTableDataSource(
            this.orderDetail.order_studies
        );
    }

    ngOnInit(): void {
        this.discountsFormArray = this.setDiscountsForm(
            this.orderDetail.order_discounts || []
        );
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    renderDynamicComponent(componentType: string): void {
        this.isLoading = true;
        this.viewContainerRef = this.adHost.viewContainerRef;
        this.viewContainerRef.clear();
        this.sidenav?.open().then(() => {
            let historicComponentInstance: ComponentRef<PaymentHistoricalTransactionsComponent>;
            let notesComponentInstance: ComponentRef<NotesComponent>;

            switch (componentType) {
                case 'historicPayment':
                    historicComponentInstance =
                        this.viewContainerRef.createComponent<PaymentHistoricalTransactionsComponent>(
                            PaymentHistoricalTransactionsComponent
                        );

                    historicComponentInstance.instance.title =
                        'Historial de pagos realizados';
                    historicComponentInstance.instance.incomingPayments =
                        this.orderDetail.order_payments || [];
                    historicComponentInstance.instance.orderId =
                        this.orderDetail.order_id || '';

                    this.isLoading = false;

                    historicComponentInstance.instance.setNewOrderData.subscribe(
                        (data: any) => {
                            const orderId = this.orderDetail.order_id;
                            this.patientService
                                .getOrderDetail(orderId || '')
                                .subscribe((data) => {
                                    this.orderDetail = data;
                                    historicComponentInstance.instance.incomingPayments =
                                        this.orderDetail.order_payments || [];
                                });
                        }
                    );

                    historicComponentInstance.instance.deletePaymentFromOrderEmmit.subscribe(
                        (data: any) => {
                            const orderId = this.orderDetail.order_id;
                            this.patientService
                                .getOrderDetail(orderId || '')
                                .subscribe((data) => {
                                    this.orderDetail = data;
                                    historicComponentInstance.instance.incomingPayments =
                                        this.orderDetail.order_payments || [];
                                });
                        }
                    );

                    historicComponentInstance.instance.closeSidenavEmmit.subscribe(
                        () => {
                            this.sidenav.close();
                        }
                    );

                    historicComponentInstance.onDestroy(() => {
                        this.isLoading = false;
                        this.viewContainerRef.clear();
                    });

                    break;
                case 'notes':
                    notesComponentInstance =
                        this.viewContainerRef.createComponent<NotesComponent>(
                            NotesComponent
                        );
                    notesComponentInstance.instance.title = 'Notas';
                    notesComponentInstance.instance.notes =
                        this.orderDetail.order_notes || [];
                    notesComponentInstance.instance.orderId =
                        this.orderDetail.order_id || '';

                    this.isLoading = false;

                    notesComponentInstance.instance.setNewNoteData.subscribe(
                        (data: any) => {
                            const orderId = this.orderDetail.order_id;
                            this.patientService
                                .getOrderDetail(orderId || '')
                                .subscribe((data) => {
                                    this.orderDetail = data;
                                    notesComponentInstance.instance.notes =
                                        this.orderDetail.order_notes || [];
                                });
                        }
                    );

                    notesComponentInstance.instance.deleteNoteFromOrderEmmit.subscribe(
                        (data: any) => {
                            const orderId = this.orderDetail.order_id;
                            this.patientService
                                .getOrderDetail(orderId || '')
                                .subscribe((data) => {
                                    this.orderDetail = data;
                                    notesComponentInstance.instance.notes =
                                        this.orderDetail.order_notes || [];
                                });
                        }
                    );

                    notesComponentInstance.instance.closeSidenavEmmit.subscribe(
                        () => {
                            this.sidenav.close();
                        }
                    );

                    notesComponentInstance.onDestroy(() => {
                        this.isLoading = false;
                        this.viewContainerRef.clear();
                    });

                    break;
                default:
                    this.isLoading = false;
                    this.sidenav.close();
                    break;
            }
        });
    }

    closeSidenav(): void {
        this.sidenav.close();
    }

    transformStudiesInFormArray(source: Study[]): FormArray {
        const studiesFormArray: FormArray = this._fb.array([]);

        source.map((study: Study) => {
            studiesFormArray.insert(
                studiesFormArray.controls.length,
                this.addStudyGroupForm(study)
            );
        });

        return studiesFormArray;
    }

    addStudyGroupForm(study: Study): FormGroup {
        return this._fb.group({
            study_id: new FormControl(study.study_id || ''),
            name: new FormControl(study.name || ''),
            alias: new FormControl(study.alias || ''),
            price: new FormControl(study.price || ''),
            grandTotal: new FormControl(study.grandTotal || ''),
            discountPercentage: new FormControl(study.discountPercentage || ''),
            deliveryDays: new FormControl(study.deliveryDays || ''),
            conditions: new FormControl(study.conditions || ''),
            notes: new FormControl(study.notes || ''),
            isEditable: new FormControl(false),
        });
    }

    setDiscountsForm(discountsFormArray: Discount[]): FormArray {
        const _discountsFormArray: FormArray = this._fb.array([]);

        discountsFormArray?.forEach((control) => {
            _discountsFormArray.insert(
                this.discountsFormArray?.length,
                this._fb.group({
                    discount_id: [control['discount_id']],
                    name: [control['name'], Validators.required],
                    discountPercentage: [
                        control['discountPercentage'],
                        Validators.required,
                    ],
                })
            );
        });

        return _discountsFormArray;
    }

    findDiscountById(id: number, discounts: Discount[]): string {
        let discountName = '';
        discounts.map((discount) => {
            if (discount.discount_id === id) {
                discountName = discount.name;
            }
        });
        return discountName;
    }

    openChangeDeliverStatusDialog(): void {
        const dialogRef = this.dialog.open(GenericModalComponent, {
            minWidth: '800px',
            data: {
                title: `¿SEGURO QUE DESEA MARCAR COMO COMPLETADA LA ORDEN"?`,
                content:
                    'Al completar la orden pasará cambiarán el estado de la entrega como ENTREGADO y estatus de la orden como COMPLETADA',
                actions: {
                    main: 'COMPLETAR ORDEN',
                    secondary: 'CANCELAR',
                },
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result === true) {
                console.log('Changing DELIVERY statys...');
                // this.orderQuoteService
                //     .updateOrder(order, orderId)
                //     .subscribe(() => {
                //         this._snackBar.open(`ORDEN ACTUALIZADA`, 'CERRAR');
                //     });
            }
        });
    }

    openCancelOrderDialog(): void {
        const dialogRef = this.dialog.open(GenericModalComponent, {
            minWidth: '800px',
            data: {
                title: `¿SEGURO QUE DESEA CANCELAR LA ORDEN"?`,
                content:
                    'Cuando se cancele la orden no podrá modificar los datos, y tendrá que crear una nueva',
                actions: {
                    main: 'CANCELAR ORDEN',
                    secondary: 'CANCELAR',
                },
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result === true) {
                // TODO: Cancel order
                console.log('Cancelling order...');
                // this.orderQuoteService
                //     .updateOrder(order, orderId)
                //     .subscribe(() => {
                //         this._snackBar.open(`ORDEN ACTUALIZADA`, 'CERRAR');
                //     });
            }
        });
    }

    openAndGeneratePdfOrderQuote(): void {
        console.log('Generating PDF...');
        // const dialogRef = this.dialog.open(OrderQuotePdfComponent, {
        //     minWidth: '800px',
        //     data: {
        //         actions: {
        //             main: 'COMPLETAR ORDEN',
        //             secondary: 'CANCELAR',
        //         },
        //     },
        // });
    }

    openChangeStudyStatusDialog(studyId: string): void {
        // TODO: Call the right service to change the workProgress of each study
        // this.orderQuoteService
        //     .updateOrder(order, orderId)
        //     .subscribe(() => {
        //         this._snackBar.open(`ORDEN ACTUALIZADA`, 'CERRAR');
        //     });
        this._snackBar.open(`ESTUDIO ACTUALIZADO`, 'CERRAR');
    }
}
