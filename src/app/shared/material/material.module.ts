import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
    declarations: [],
    imports: [CommonModule],
    exports: [MatFormFieldModule, MatInputModule, MatButtonModule],
})
export class MaterialModule {}
