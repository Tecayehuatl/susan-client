import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import {
    DeliveryStatus,
    GeneralOrderStatus,
    PaymentStatus,
} from '../../utils/utils';

@Component({
    selector: 'app-label',
    templateUrl: './label.component.html',
    styleUrls: ['./label.component.scss'],
})
export class LabelComponent {
    @ViewChild('labelElement', { static: true }) labelElement!: ElementRef;
    @Input() type!: string;
    @Input() set value(value: any) {
        if (this.type && value)
            this.renderLabel(this.labelElement, this.type, value);
    }

    generalOrderStatus = GeneralOrderStatus;
    paymentStatus: typeof PaymentStatus = PaymentStatus;
    deliveryStatus: typeof DeliveryStatus = DeliveryStatus;

    renderLabel(el: ElementRef, type: string, value: any): void {
        const element = el.nativeElement;
        let statusText = '';
        let cssClass = '';

        switch (type) {
            case 'generalOrderStatus':
                statusText = this.getStringFromEnum(
                    this.generalOrderStatus,
                    value
                );
                switch (statusText) {
                    case this.generalOrderStatus[1]:
                        cssClass = 'label--info';
                        break;
                    case this.generalOrderStatus[2]:
                        cssClass = 'label--warn';
                        break;
                    case this.generalOrderStatus[3]:
                        cssClass = 'label--success';
                        break;
                    default:
                        break;
                }

                element.classList.remove(element.classList[1]);
                element.classList.add(cssClass);
                break;
            case 'paymentStatus':
                statusText = this.getStringFromEnum(this.paymentStatus, value);
                switch (statusText) {
                    case this.paymentStatus[1]:
                        cssClass = 'label--success';
                        break;
                    case this.paymentStatus[2]:
                        cssClass = 'label--warn';
                        break;
                    case this.paymentStatus[3]:
                        cssClass = 'label--warn';
                        break;
                    default:
                        break;
                }
                element.classList.remove(element.classList[1]);
                element.classList.add(cssClass);
                break;
            case 'deliveryStatus':
                statusText = this.getStringFromEnum(this.deliveryStatus, value);
                switch (statusText) {
                    case this.deliveryStatus[1]:
                        cssClass = 'label--success';
                        break;
                    case this.deliveryStatus[2]:
                        cssClass = 'label--warn';
                        break;
                    case this.deliveryStatus[3]:
                        cssClass = 'label--warn';
                        break;
                    default:
                        break;
                }
                element.classList.remove(element.classList[1]);
                element.classList.add(cssClass);
                break;
            default:
                break;
        }
    }

    getStringFromEnum(
        enumerator: { [key: string]: any },
        value: string
    ): string {
        let itemString = '';

        itemString = enumerator[value];

        return itemString;
    }
}
