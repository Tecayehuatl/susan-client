import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeLayoutComponent } from './layout/home-layout.component';
import { AppRoutingModule } from '../app-routing.module';

@NgModule({
  declarations: [
    HomeLayoutComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule
  ]
})
export class HomeModule { }
