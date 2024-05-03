import { Study } from 'src/app/dashboard/studies/studies.component';

// This will return the grandTotal, with or without discount
export function getGrandTotal(price: number, porcentage: number): number {
    if (porcentage) {
        const discount = price * (+porcentage / 100);
        return price - +discount.toFixed(2);
    } else {
        return price;
    }
}

export enum OperationType {
    TOTAL_CALCULATION = 'totalCalculation',
    SUBTOTAL_CALCULATION = 'subtotalCalculation',
    DISCOUNT_CALCULATION = 'discountCalculation',
    TAX_CALCULATION = 'taxCalculation',
    GRAND_TOTAL_CALCULATION = 'grandTotalCalculation',
}

export enum GeneralOrderStatus {
    ONGOING = 1,
    CANCELLED = 2,
    COMPLETED = 3,
}

export enum PaymentStatus {
    COMPLETED = 1,
    PENDING = 2,
    CANCELLED = 3,
}

export enum DeliveryStatus {
    DELIVERED = 1,
    NOT_DELIVERED = 2,
    CANCELLED = 3,
}

export function transformPrices(_labStudies: Study[], ...args: any[]): number {
    let total = 0;
    let subtotal = 0;
    let discount = 0;
    let tax = 0;
    let grandTotal = 0;

    /**
     * Dependencies
     */
    const TAX_BASE = 16;
    const _discounts: number[] = args[0] || [];
    const _operationType: string = args[1] || undefined;
    let _totalBaseDiscounts = 0;

    /**
     * 1.- Getting the total
     */
    _labStudies.map((study: Study) => {
        total = total + +study.grandTotal;
    });

    /**
     * 2.- This will return values only when discounts are present.
     *     Getting the discount amount
     */

    _totalBaseDiscounts = total;
    _discounts.map((_discountNumber: number) => {
        const singleDiscount = _totalBaseDiscounts * (_discountNumber / 100);
        _totalBaseDiscounts = _totalBaseDiscounts - singleDiscount;

        discount = discount + singleDiscount;
    });

    /**
     * 3.- Getting the subtotal, NO TAX INCLUDED and subtotal with DISCOUNTS included
     */
    subtotal = _totalBaseDiscounts / 1.16;

    /**
     * 4.- Getting the grand total(final payment)
     */
    grandTotal = total - discount;

    /**
     * 5.- Getting the tax from grand total(last step)
     */
    tax = grandTotal - grandTotal / 1.16;

    switch (_operationType) {
        case OperationType.TOTAL_CALCULATION:
            return total;
        case OperationType.SUBTOTAL_CALCULATION:
            return subtotal;
        case OperationType.DISCOUNT_CALCULATION:
            return discount;
        case OperationType.TAX_CALCULATION:
            return tax;
        case OperationType.GRAND_TOTAL_CALCULATION:
            return grandTotal;
        default:
            return 0;
    }
}
