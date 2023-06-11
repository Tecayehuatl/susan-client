import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeLayoutComponent } from './layout/home-layout.component';
import { AppRoutingModule } from '../app-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    HomeLayoutComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    SharedModule
  ]
})
export class HomeModule { }
