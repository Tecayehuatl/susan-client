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
import { roleGuard } from '../shared/guards/role.guard';
import { UserRole } from './users/create-edit-users/create-edit-users.component';

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
                canActivate: [roleGuard],
                data: {
                    roles: [
                        UserRole.ADMIN,
                        UserRole.SUPER,
                        UserRole.CASHIER,
                        UserRole.OPERATOR,
                        UserRole.VIEWER,
                    ],
                },
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
                canActivate: [roleGuard],
                data: {
                    roles: [
                        UserRole.ADMIN,
                        UserRole.SUPER,
                        UserRole.CASHIER,
                        UserRole.OPERATOR,
                        UserRole.VIEWER,
                    ],
                },
            },
            {
                path: 'patients/:patientId/:orderId',
                resolve: {
                    orderDetail: getOrderDetailResolver,
                },
                component: OrderDetailComponent,
                canActivate: [roleGuard],
                data: {
                    roles: [
                        UserRole.ADMIN,
                        UserRole.SUPER,
                        UserRole.CASHIER,
                        UserRole.OPERATOR,
                        UserRole.VIEWER,
                    ],
                },
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
                canActivate: [roleGuard],
                data: {
                    roles: [
                        UserRole.ADMIN,
                        UserRole.SUPER,
                        UserRole.CASHIER,
                        UserRole.OPERATOR,
                        UserRole.VIEWER,
                    ],
                },
            },
            {
                path: 'branch-offices',
                component: BranchOfficesComponent,
                canActivate: [roleGuard],
                data: {
                    roles: [UserRole.ADMIN, UserRole.SUPER],
                },
            },
            {
                path: 'discounts',
                component: DiscountsComponent,
                canActivate: [roleGuard],
                data: {
                    roles: [UserRole.ADMIN, UserRole.SUPER],
                },
            },
            {
                path: 'doctors',
                component: DoctorsComponent,
                canActivate: [roleGuard],
                data: {
                    roles: [UserRole.ADMIN, UserRole.SUPER],
                },
            },
            {
                path: 'studies',
                component: StudiesComponent,
                canActivate: [roleGuard],
                data: {
                    roles: [UserRole.ADMIN, UserRole.SUPER],
                },
            },
            {
                path: 'users',
                component: UsersComponent,
                resolve: { branchOffices: getBranchOfficesResolver },
                canActivate: [roleGuard],
                data: {
                    roles: [UserRole.ADMIN, UserRole.SUPER],
                },
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DashboardRoutingModule {}
