import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-generic-modal',
    templateUrl: './generic-modal.component.html',
    styleUrls: ['./generic-modal.component.scss'],
})
export class GenericModalComponent {
    constructor(
        public dialogRef: MatDialogRef<GenericModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData
    ) {}

    closeModal(): void {
        this.dialogRef.close();
    }
}

export interface DialogData {
    title: string;
    actions: {
        main: string;
        secondary: string;
    };
    content: string;
}
