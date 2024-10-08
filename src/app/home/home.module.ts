import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { HomeRoutingModule } from './home-routing.module';
import { LayoutComponent } from './layout/layout.component';
import { SharedModule } from '../shared/shared.module';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { FaqComponent } from './faq/faq.component';

@NgModule({
    declarations: [HomeComponent, LayoutComponent, PrivacyPolicyComponent, FaqComponent],
    imports: [CommonModule, HomeRoutingModule, SharedModule],
})
export class HomeModule {}
