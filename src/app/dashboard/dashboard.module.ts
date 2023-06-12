import { NgModule } from '@angular/core';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { PatientsComponent } from './patients/patients.component';
import { SharedModule } from '../shared/shared.module';
import { CreateEditPatientComponent } from './patients/create-edit-patient/create-edit-patient.component';

@NgModule({
    declarations: [PatientsComponent, CreateEditPatientComponent],
    imports: [DashboardRoutingModule, SharedModule],
})
export class DashboardModule {}
