import { NgModule } from '@angular/core';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { PatientsComponent } from './patients/patients.component';
import { SharedModule } from '../shared/shared.module';
import { CreateEditPatientComponent } from './patients/create-edit-patient/create-edit-patient.component';
import { PatientDetailComponent } from './patients/patient-detail/patient-detail.component';

@NgModule({
    declarations: [
        PatientsComponent,
        CreateEditPatientComponent,
        PatientDetailComponent,
    ],
    imports: [DashboardRoutingModule, SharedModule],
})
export class DashboardModule {}
