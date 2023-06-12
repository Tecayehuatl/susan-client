import { NgModule } from '@angular/core';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { PatientsComponent } from './patients/patients.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
    declarations: [PatientsComponent],
    imports: [DashboardRoutingModule, SharedModule],
})
export class DashboardModule {}
