import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material/material.module';
import { RouterModule } from '@angular/router';
import { GenericModalComponent } from './components/generic-modal/generic-modal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { OrderSummaryComponent } from './components/order-summary/order-summary.component';

const imports = [GenericModalComponent, OrderSummaryComponent];

@NgModule({
    declarations: [...imports],
    imports: [MaterialModule, NgxMaskModule.forRoot()],
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
