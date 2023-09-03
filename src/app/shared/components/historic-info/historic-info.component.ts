import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-historic-info',
    templateUrl: './historic-info.component.html',
    styleUrls: ['./historic-info.component.scss'],
})
export class HistoricInfoComponent {
    @Input() item!: any;
}
