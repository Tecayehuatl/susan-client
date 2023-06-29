import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material/material.module';
import { RouterModule } from '@angular/router';
import { GenericModalComponent } from './components/generic-modal/generic-modal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { OrderSummaryComponent } from './components/order-summary/order-summary.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { DiscountsComponent } from './components/discounts/discounts.component';
import { PaymentComponent } from './components/payment/payment.component';

const imports = [
    GenericModalComponent,
    OrderSummaryComponent,
    DiscountsComponent,
    PaymentComponent,
];

@NgModule({
    declarations: [...imports, NotFoundComponent],
    imports: [CommonModule, MaterialModule, NgxMaskModule.forRoot()],
    exports: [
        ...imports,
        CommonModule,
        MaterialModule,
        RouterModule,
        ReactiveFormsModule,
        NgxMaskModule,
    ],
})
export class SharedModule {}
