import { NgModule } from '@angular/core';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { PatientsComponent } from './patients/patients.component';
import { SharedModule } from '../shared/shared.module';
import { CreateEditPatientComponent } from './patients/create-edit-patient/create-edit-patient.component';
import { PatientDetailComponent } from './patients/patient-detail/patient-detail.component';
import { OrdersComponent } from './orders/orders.component';
import { OrderDetailComponent } from './orders/order-detail/order-detail.component';
import { BranchOfficesComponent } from './branch-offices/branch-offices.component';
import { CreateEditBranchOfficesComponent } from './branch-offices/create-edit-branch-offices/create-edit-branch-offices.component';
import { DoctorsComponent } from './doctors/doctors.component';
import { CreateEditDoctorsComponent } from './doctors/create-edit-doctors/create-edit-doctors.component';
import { StudiesComponent } from './studies/studies.component';
import { CreateEditStudiesComponent } from './studies/create-edit-studies/create-edit-studies.component';
import { UsersComponent } from './users/users.component';
import { CreateEditUsersComponent } from './users/create-edit-users/create-edit-users.component';
import { CreateOrderQuoteComponent } from './orders/create-order-quote/create-order-quote.component';
import { DiscountsComponent } from './discounts/discounts.component';
import { CreateEditDiscountsComponent } from './discounts/create-edit-discounts/create-edit-discounts.component';
import { QuotesComponent } from './quotes/quotes.component';

@NgModule({
    declarations: [
        BranchOfficesComponent,
        CreateEditBranchOfficesComponent,
        CreateEditDiscountsComponent,
        CreateEditDoctorsComponent,
        CreateEditPatientComponent,
        CreateEditStudiesComponent,
        CreateEditUsersComponent,
        CreateOrderQuoteComponent,
        DiscountsComponent,
        DoctorsComponent,
        OrdersComponent,
        OrderDetailComponent,
        PatientsComponent,
        PatientDetailComponent,
        StudiesComponent,
        UsersComponent,
        QuotesComponent,
    ],
    imports: [DashboardRoutingModule, SharedModule],
})
export class DashboardModule {}
