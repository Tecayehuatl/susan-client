import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MaterialModule } from './material/material.module';
import { RouterModule } from '@angular/router';
import { GenericModalComponent } from './components/generic-modal/generic-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OrderSummaryComponent } from './components/order-summary/order-summary.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { DiscountsComponent } from './components/discounts/discounts.component';
import { PaymentComponent } from './components/payment/payment.component';
import { GetOrderStatusPipe } from './pipes/get-order-status.pipe';
import { PaymentHistoricalTransactionsComponent } from './components/payment-historical-transactions/payment-historical-transactions.component';
import { AdHostDirective } from './directives/ad-host.directive';
import { HistoricInfoComponent } from './components/historic-info/historic-info.component';
import { NotesComponent } from './components/notes/notes.component';
import { CreateEditPaymentsComponent } from './components/payments/create-edit-payments/create-edit-payments.component';
import { CreateEditNotesComponent } from './components/notes/create-edit-notes/create-edit-notes.component';
import { LabelComponent } from './components/label/label.component';
import { ToUppercaseDirective } from './directives/to-uppercase.directive';
import { DynamicValidatorDirective } from './directives/dynamic-validator.directive';

const imports = [
    AdHostDirective,
    HistoricInfoComponent,
    DiscountsComponent,
    GenericModalComponent,
    GetOrderStatusPipe,
    OrderSummaryComponent,
    PaymentComponent,
    PaymentHistoricalTransactionsComponent,
    NotesComponent,
    CreateEditPaymentsComponent,
    LabelComponent,
    CreateEditNotesComponent,
    ToUppercaseDirective,
    DynamicValidatorDirective,
];

@NgModule({
    declarations: [...imports, NotFoundComponent],
    imports: [
        CommonModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        NgxMaskDirective,
        NgxMaskPipe,
    ],
    exports: [
        ...imports,
        CommonModule,
        MaterialModule,
        RouterModule,
        ReactiveFormsModule,
        FormsModule,
        NgxMaskDirective,
        NgxMaskPipe,
        ClipboardModule,
    ],
    providers: [
        provideNgxMask(),
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
    ],
})
export class SharedModule {}
