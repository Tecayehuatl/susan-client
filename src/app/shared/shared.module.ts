import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material/material.module';
import { RouterModule } from '@angular/router';
import { GenericModalComponent } from './components/generic-modal/generic-modal.component';

const imports = [GenericModalComponent];

@NgModule({
    declarations: [...imports],
    imports: [MaterialModule],
    exports: [CommonModule, MaterialModule, RouterModule],
})
export class SharedModule {}
