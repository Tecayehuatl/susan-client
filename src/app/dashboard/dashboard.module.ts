import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { PatientsComponent } from './patients/patients.component';

@NgModule({
    declarations: [PatientsComponent],
    imports: [CommonModule, DashboardRoutingModule],
})
export class DashboardModule {}
