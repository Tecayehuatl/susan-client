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
    patientId!: string;
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
    isLoading = true;
    viewContainerRef!: ViewContainerRef;
    studiesFormArray!: FormArray;
    discountsFormArray!: FormArray;
    orderStudies!: Study[];

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
        this.patientId = this.route.snapshot.params['patientId'];

        // Assign the data to the data source for the table to render
        this.orderDetail = this.route.snapshot.data['orderDetail'];
        this.orderStudies = this.orderDetail.order_studies || [];

        this.studiesFormArray = this.transformStudiesInFormArray(
            this.orderStudies
        );

        this.dataSource = new MatTableDataSource(this.orderStudies);
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
                    historicComponentInstance.instance.orderStatusId =
                        this.orderDetail.order_status_id;
                    historicComponentInstance.instance.paymentStatusId =
                        this.orderDetail.payment_status_id;

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

    openChangeDeliverStatusDialog(): void {
        const dialogRef = this.dialog.open(GenericModalComponent, {
            minWidth: '800px',
            data: {
                title: `¿SEGURO QUE DESEA MARCAR COMO ENTREGADA LA ORDEN"?`,
                content:
                    'Al marcar la orden como entregada se entiende que ha trabajado todos los estudios y los pagos han sido cubiertos por parte del paciente.',
                actions: {
                    main: 'MARCAR COMO ENTREGADA LA ORDEN',
                    secondary: 'CANCELAR',
                },
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result === true) {
                const order = {
                    // TODO: Try to get this valeu change dynamically
                    delivery_status_id: 1,
                };
                const orderId = this.orderDetail.order_id || '';
                this.orderQuoteService
                    .updateOrder(order, orderId)
                    .subscribe(() => {
                        this._snackBar.open(
                            `ORDEN MARCADA COMO ENTREGADA`,
                            'CERRAR'
                        );
                        this.getOrderDatailData(orderId);
                    });
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
                const order = {
                    // TODO: Try to get this cancelation value dynamically
                    order_status_id: 2,
                };
                const orderId = this.orderDetail.order_id || '';
                this.orderQuoteService
                    .updateOrder(order, orderId)
                    .subscribe(() => {
                        this._snackBar.open(`ORDEN CANCELADA`, 'CERRAR');
                        this.getOrderDatailData(orderId);
                    });
            }
        });
    }

    openAndGeneratePdfOrderQuote(id: string): void {
        console.log('Generating PDF...');
        window.open(`http://localhost:3000/orders/${id}/pdf`);
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

    openChangeStudyStatusDialog(
        orderId: string,
        studyId: string,
        status: boolean
    ): void {
        // TODO: Call the right service to change the workProgress of each study
        this.orderQuoteService
            .updateOrderStudyStatus(orderId, studyId, { inProgress: !status })
            .subscribe((studyUpdated) => {
                console.log('response, ', studyUpdated);
                this._snackBar.open(`ESTUDIO ACTUALIZADO`, 'CERRAR');
                // TODO: Update the row, specifically the inProgress status with the response

                this.orderStudies = this.updateStudy(studyUpdated);
                this.dataSource = new MatTableDataSource(this.orderStudies);
                this.getOrderDatailData(orderId);
                //TODO: Verify why the service is returning sometimes the same value with no change, example: if I change the status of a single study, there're times where the services is not returning the opposite value, just returns the same value. It works for now.
            });
    }

    getOrderDatailData(orderId: string): void {
        this.patientService.getOrderDetail(orderId).subscribe((data) => {
            this.orderDetail = data;
        });
    }

    updateStudy(study: Study): Study[] {
        const _studies: Study[] = [];
        this.orderStudies.map((_study) => {
            if (_study.order_study_id === study.order_study_id) {
                _studies.push({
                    ..._study,
                    inProgress: study.inProgress,
                });
            } else {
                _studies.push(_study);
            }
        });

        return _studies;
    }
}
