import { Component, Input, OnInit } from '@angular/core';
import { OrderNote } from 'src/app/services/orders-quotes.service';
import { HistoricInfoItem } from '../historic-info/historic-info.component';

@Component({
    selector: 'app-payment-historical-transactions',
    templateUrl: './payment-historical-transactions.component.html',
    styleUrls: ['./payment-historical-transactions.component.scss'],
})
export class PaymentHistoricalTransactionsComponent implements OnInit {
    @Input() title!: string;
    @Input() titleIcon!: string;
    @Input() notes!: OrderNote[];
    notesTransformed!: HistoricInfoItem[];

    ngOnInit(): void {
        this.notesTransformed = this.transformNotes(this.notes);
    }

    transformNotes(notes: OrderNote[]): HistoricInfoItem[] {
        const transformed: HistoricInfoItem[] = notes.map(
            (note: OrderNote) => ({
                title: note.note,
            })
        );
        return transformed;
    }
}
