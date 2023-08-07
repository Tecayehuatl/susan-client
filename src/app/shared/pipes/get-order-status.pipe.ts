import { Pipe, PipeTransform } from '@angular/core';
import {
    DeliveryStatus,
    GeneralOrderStatus,
    PaymentStatus,
} from '../utils/utils';

@Pipe({
    name: 'getOrderStatus',
    pure: true,
})
export class GetOrderStatusPipe implements PipeTransform {
    transform(id: any, type: string): string {
        let statusText = '';
        switch (type) {
            case 'generalOrderStatus':
                if (GeneralOrderStatus.ONGOING === id) statusText = 'en curso';
                if (GeneralOrderStatus.CANCELLED === id)
                    statusText = 'cancelado';
                if (GeneralOrderStatus.CLOSED === id) statusText = 'cerrado';
                break;
            case 'paymentStatus':
                if (PaymentStatus.COMPLETED === id) statusText = 'completado';
                if (PaymentStatus.PENDING === id) statusText = 'pendiente';
                if (PaymentStatus.CANCELLED === id) statusText = 'cancelado';
                break;
            case 'deliveryStatus':
                if (DeliveryStatus.DELIVERED === id) statusText = 'entregado';
                if (DeliveryStatus.NOT_DELIVERED === id)
                    statusText = 'no entregado';
                if (DeliveryStatus.CANCELLED === id) statusText = 'cancelado';
                break;
            default:
                break;
        }
        return statusText;
    }
}
