import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardLayoutComponent } from './layout/dashboard-layout.component';
import { DoctorsComponent } from './doctors/doctors.component';

@NgModule({
  declarations: [
    DashboardLayoutComponent,
    DoctorsComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
  ],
  exports: []
})
export class DashboardModule { }
