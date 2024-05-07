import { Directive, HostListener } from '@angular/core';
import { NgControl, Validators } from '@angular/forms';

@Directive({
    selector: '[appDynamicValidator]',
})
export class DynamicValidatorDirective {
    constructor(private ngControl: NgControl) {}

    @HostListener('input', ['$event.target.value'])
    onInput(value: string) {
        if (value) {
            this.ngControl?.control?.addValidators(Validators.email);
        } else {
            this.ngControl?.control?.removeValidators(Validators.email);
        }
    }
}
