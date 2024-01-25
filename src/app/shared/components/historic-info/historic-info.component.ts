import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GenericModalComponent } from '../generic-modal/generic-modal.component';

@Component({
    selector: 'app-historic-info',
    templateUrl: './historic-info.component.html',
    styleUrls: ['./historic-info.component.scss'],
})
export class HistoricInfoComponent {
    @Input() historicInfoItem!: HistoricInfoItem;
    @Output() deleteEmmiter: EventEmitter<boolean> = new EventEmitter();

    constructor(private dialog: MatDialog) {}

    openDeleteModal(): void {
        const dialogRef = this.dialog.open(GenericModalComponent, {
            minWidth: '800px',
            data: {
                title: `¿SEGURO QUE DESEA ELIMINAR El ITEM"?`,
                actions: {
                    main: 'ELIMINAR',
                    secondary: 'CANCELAR',
                },
            },
        });

        dialogRef.afterClosed().subscribe((response) => {
            if (response === true) this.deleteEmmiter.emit();
        });
    }
}

export interface HistoricInfoItem {
    id?: string;
    title?: string;
    subtitle?: string;
    description?: string;
    date?: string;
    isDeleteActionIncluded?: boolean;
}
