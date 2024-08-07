import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from '../dashboard/layout/layout.component';
import { PatientsComponent } from './patients/patients.component';
import { PatientDetailComponent } from './patients/patient-detail/patient-detail.component';
import { OrderDetailComponent } from './orders/order-detail/order-detail.component';
import { BranchOfficesComponent } from './branch-offices/branch-offices.component';
import { DoctorsComponent } from './doctors/doctors.component';
import { StudiesComponent } from './studies/studies.component';
import { UsersComponent } from './users/users.component';
import { getBranchOfficesResolver } from '../services/branch-offices.service';
import {
    getAllOrdersQuotesPatientResolver,
    getOrderDetailResolver,
    getPatientDetailResolver,
} from '../services/patients.service';
import { getPaymentMethodsResolver } from '../services/payment-methods.service';
import { getDoctorsResolver } from '../services/doctors.service';
import { DiscountsComponent } from './discounts/discounts.component';
import { getDiscountslResolver } from '../services/discounts.service';
import { QuotesComponent } from './quotes/quotes.component';
import { getStudiesResolver } from '../services/studies.service';

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            {
                path: '',
                redirectTo: 'patients',
                pathMatch: 'full',
            },
            {
                path: 'patients',
                component: PatientsComponent,
            },
            {
                path: 'patients/:patientId',
                resolve: {
                    paymentMethods: getPaymentMethodsResolver,
                    doctors: getDoctorsResolver,
                    patient: getPatientDetailResolver,
                    patientAllOrdersQuotes: getAllOrdersQuotesPatientResolver,
                },
                component: PatientDetailComponent,
            },
            {
                path: 'patients/:patientId/:orderId',
                resolve: {
                    orderDetail: getOrderDetailResolver,
                },
                component: OrderDetailComponent,
            },
            {
                path: 'quotes',
                component: QuotesComponent,
                resolve: {
                    doctors: getDoctorsResolver,
                    studies: getStudiesResolver,
                    branchOffices: getBranchOfficesResolver,
                    paymentMethods: getPaymentMethodsResolver,
                },
            },
            {
                path: 'branch-offices',
                component: BranchOfficesComponent,
            },
            {
                path: 'discounts',
                component: DiscountsComponent,
            },
            {
                path: 'doctors',
                component: DoctorsComponent,
            },
            {
                path: 'studies',
                component: StudiesComponent,
            },
            {
                path: 'users',
                component: UsersComponent,
                resolve: { branchOffices: getBranchOfficesResolver },
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DashboardRoutingModule {}
