import { AfterViewInit, Component, Input } from '@angular/core';
import { FormArray } from '@angular/forms';
import { OperationType, transformPrices } from '../../utils/utils';
import { Study } from 'src/app/dashboard/studies/studies.component';
import { Discount } from 'src/app/services/discounts.service';

@Component({
    selector: 'app-order-summary',
    templateUrl: './order-summary.component.html',
    styleUrls: ['./order-summary.component.scss'],
})
export class OrderSummaryComponent implements AfterViewInit {
    @Input() studiesForm!: FormArray;
    @Input() discountsForm!: FormArray;
    total = 0;
    subtotal = 0;
    discount = 0;
    tax = 0;
    grandTotal = 0;
    studies: any;
    discounts!: any[];

    ngAfterViewInit(): void {
        this.studiesForm.valueChanges.subscribe((studies) => {
            this.studies = studies;
            this.calculateOrder(
                this.studies,
                this.extractDiscounts(this.discounts)
            );
        });
        this.discountsForm.valueChanges.subscribe((discounts) => {
            console.log('discounts ', discounts);
            this.discounts = discounts;
            this.calculateOrder(
                this.studies,
                this.extractDiscounts(this.discounts)
            );
        });
    }

    calculateOrder(studies: Study[], discounts: any[]): void {
        this.total = transformPrices(
            studies,
            discounts,
            OperationType.TOTAL_CALCULATION
        );
        this.subtotal = transformPrices(
            studies,
            discounts,
            OperationType.SUBTOTAL_CALCULATION
        );
        this.discount = transformPrices(
            studies,
            discounts,
            OperationType.DISCOUNT_CALCULATION
        );
        this.tax = transformPrices(
            studies,
            discounts,
            OperationType.TAX_CALCULATION
        );
        this.grandTotal = transformPrices(
            studies,
            discounts,
            OperationType.GRAND_TOTAL_CALCULATION
        );
    }

    extractDiscounts(discountsObject: any[]): number[] {
        let discounts: any[] = [];
        if (discountsObject?.length > 0) {
            discountsObject.forEach((discount: Discount) => {
                if (discount.discountPercentage)
                    discounts = [...discounts, discount.discountPercentage];
            });
        }
        return discounts;
    }
}
