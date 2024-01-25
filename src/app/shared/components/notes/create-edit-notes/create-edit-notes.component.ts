import { Component, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OrdersQuotesService } from 'src/app/services/orders-quotes.service';

@Component({
    selector: 'app-create-edit-notes',
    templateUrl: './create-edit-notes.component.html',
    styleUrls: ['./create-edit-notes.component.scss'],
})
export class CreateEditNotesComponent {
    notesForm: FormGroup = this._fb.group({
        notes: this._fb.array([
            this._fb.group({
                note: [null, [Validators.required, Validators.maxLength(1000)]],
            }),
        ]),
    });

    get notesFormArray(): FormArray {
        return this.notesForm.get('notes') as FormArray;
    }

    constructor(
        public dialogRef: MatDialogRef<CreateEditNotesComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _fb: FormBuilder,
        private orderService: OrdersQuotesService
    ) {}

    addNoteToOrder(): void {
        const note = this.notesForm.value;

        // TODO: Send the paymentsFormArray back to the view, currently the API response don't return the payments recently added
        this.orderService
            .updateOrder(note, this.data.orderId)
            .subscribe((data) => {
                this.dialogRef.close(note);
            });
    }
}
