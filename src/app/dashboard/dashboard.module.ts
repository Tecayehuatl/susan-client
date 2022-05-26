import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardLayoutComponent } from './layout/dashboard-layout.component';
import { DoctorsComponent } from './doctors/doctors.component';
import { MaterialModule } from '../shared/material/material.module';
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
    MaterialModule
  ],
  exports: []
})
export class DashboardModule { }
