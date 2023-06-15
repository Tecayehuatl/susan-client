import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from '../layout/layout.component';
import { PatientsComponent } from './patients/patients.component';
import { PatientDetailComponent } from './patients/patient-detail/patient-detail.component';
import { OrderDetailComponent } from './orders/order-detail/order-detail.component';
import { BranchOfficesComponent } from './branch-offices/branch-offices.component';

const routes: Routes = [
    {
        path: 'dashboard',
        component: LayoutComponent,
        children: [
            {
                path: 'patients',
                component: PatientsComponent,
            },
            {
                path: 'patients/:patientId',
                component: PatientDetailComponent,
            },
            {
                path: 'patients/:patientId/:orderId',
                component: OrderDetailComponent,
            },
            {
                path: 'branch-offices',
                component: BranchOfficesComponent,
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DashboardRoutingModule {}
