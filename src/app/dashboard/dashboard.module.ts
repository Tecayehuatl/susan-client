import { NgModule } from '@angular/core';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { PatientsComponent } from './patients/patients.component';
import { SharedModule } from '../shared/shared.module';
import { CreateEditPatientComponent } from './patients/create-edit-patient/create-edit-patient.component';
import { PatientDetailComponent } from './patients/patient-detail/patient-detail.component';
import { OrdersComponent } from './orders/orders.component';
import { OrderDetailComponent } from './orders/order-detail/order-detail.component';

@NgModule({
    declarations: [
        CreateEditPatientComponent,
        PatientsComponent,
        PatientDetailComponent,
        OrdersComponent,
        OrderDetailComponent,
    ],
    imports: [DashboardRoutingModule, SharedModule],
})
export class DashboardModule {}
