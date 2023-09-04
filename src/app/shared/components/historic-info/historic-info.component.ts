import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-historic-info',
    templateUrl: './historic-info.component.html',
    styleUrls: ['./historic-info.component.scss'],
})
export class HistoricInfoComponent {
    @Input() historicInfoItem!: HistoricInfoItem;
}

export interface HistoricInfoItem {
    title?: string;
    subtitle?: string;
    description?: string;
    date?: string;
}
