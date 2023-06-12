import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material/material.module';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [],
    imports: [],
    exports: [CommonModule, MaterialModule, RouterModule],
})
export class SharedModule {}
