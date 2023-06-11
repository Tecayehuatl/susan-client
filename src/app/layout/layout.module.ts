import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../shared/material/material.module';

@NgModule({
    declarations: [LayoutComponent],
    imports: [CommonModule, MaterialModule, RouterModule],
})
export class LayoutModule {}
