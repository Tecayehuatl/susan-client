import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import {
    OrderNote,
    OrdersQuotesService,
} from 'src/app/services/orders-quotes.service';
import { HistoricInfoItem } from '../historic-info/historic-info.component';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { CreateEditNotesComponent } from './create-edit-notes/create-edit-notes.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-notes',
    templateUrl: './notes.component.html',
    styleUrls: ['./notes.component.scss'],
})
export class NotesComponent {
    notesTransformed: HistoricInfoItem[] = [];

    @Input() title!: string;
    @Input() titleIcon!: string;
    @Input() set notes(notes: OrderNote[]) {
        this.notesTransformed = this.transformNotes(notes);
    }

    @Input() orderId!: string;
    @Output() closeSidenavEmmit: EventEmitter<any> = new EventEmitter();
    @Output() setNewNoteData: EventEmitter<any> = new EventEmitter();
    @Output() deleteNoteFromOrderEmmit: EventEmitter<any> = new EventEmitter();

    constructor(
        public orderQuoteService: OrdersQuotesService,
        public dialog: MatDialog,
        private _snackBar: MatSnackBar,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    transformNotes(notes: OrderNote[]): HistoricInfoItem[] {
        const transformed: HistoricInfoItem[] = notes.map(
            (note: OrderNote, index) => ({
                id: note.order_note_id?.toString(),
                title: `Nota ${index + 1}`,
                subtitle: note.note,
                isDeleteActionIncluded: true,
            })
        );
        return transformed;
    }

    openAddNoteDialog(): void {
        const dialogRef = this.dialog.open(CreateEditNotesComponent, {
            width: '1100px',
            minHeight: '500px',
            data: {
                orderId: this.orderId,
            },
        });

        dialogRef.afterClosed().subscribe((newOrderData: any) => {
            if (newOrderData) {
                this._snackBar.open(`Nota agregada correctamente`, 'CERRAR');
                this.setNewNoteData.emit(newOrderData);
            }
        });
    }

    closeSidenav(): void {
        this.closeSidenavEmmit.emit('close');
    }

    deleteNoteFromOrder(noteId: string | number = '', orderId: string): void {
        this.orderQuoteService
            .deleteNoteFromOrder(orderId, noteId)
            .subscribe(() => {
                //'response' will be null, the service currently does not return anything
                this.deleteNoteFromOrderEmmit.emit();
            });
    }
}
