import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Discount } from 'src/app/services/discounts.service';

@Component({
    selector: 'app-discounts',
    templateUrl: './discounts.component.html',
    styleUrls: ['./discounts.component.scss'],
})
export class DiscountsComponent implements OnInit {
    discountsParentForm!: FormGroup;
    @Input() discountsOptionsList!: Discount[];
    @Output() sendDiscountsForm: EventEmitter<any> = new EventEmitter<any>();

    get discountsArrayControl(): FormArray {
        return this.discountsParentForm.get('discounts') as FormArray;
    }

    constructor(private fb: FormBuilder) {}

    ngOnInit(): void {
        this.discountsParentForm = this.fb.group({
            discounts: this.fb.array([]),
        });

        this.discountsArrayControl.valueChanges.subscribe((newFormValue) =>
            this.sendDiscountsForm.emit(newFormValue)
        );
    }

    addDiscount(): void {
        this.discountsArrayControl.insert(
            this.discountsArrayControl.controls.length,
            this.getNewDiscount()
        );
    }

    getNewDiscount(): FormGroup {
        return this.fb.group({
            name: ['', Validators.required],
            discountPercentage: ['', Validators.required],
        });
    }

    selectDiscount(index: number, discount: Discount): void {
        const groupDiscount = this.discountsArrayControl.get([index]);

        groupDiscount?.patchValue({
            name: discount.name,
            discountPercentage: discount.discountPercentage,
        });
    }

    removeDiscount(index: number): void {
        this.discountsArrayControl.removeAt(index);
    }
}
