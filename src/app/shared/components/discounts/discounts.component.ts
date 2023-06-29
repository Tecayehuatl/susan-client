import { Component } from '@angular/core';

@Component({
    selector: 'app-discounts',
    templateUrl: './discounts.component.html',
    styleUrls: ['./discounts.component.scss'],
})
export class DiscountsComponent {
    discounts: Discount[] = [
        {
            name: 'INAPAM10',
            value: 10,
        },
        {
            name: 'OTHER',
            value: 0,
        },
    ];
}

interface Discount {
    name: string;
    value: number;
}
