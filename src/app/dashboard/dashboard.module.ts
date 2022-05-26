import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardLayoutComponent } from './layout/dashboard-layout.component';
import { DoctorsComponent } from './doctors/doctors.component';
import { SharedModule } from '../shared/shared.module';
import { PatientsComponent } from './patients/patients.component';

@NgModule({
  declarations: [
    DashboardLayoutComponent,
    DoctorsComponent,
    PatientsComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule
  ],
  exports: []
})
export class DashboardModule { }
