import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
    selector: '[appToUppercase]',
})
export class ToUppercaseDirective {
    constructor(private ngControl: NgControl) {}

    @HostListener('input', ['$event.target.value'])
    onInput(value: string) {
        this.ngControl?.control?.patchValue(value.toUpperCase(), {
            emitEvent: false,
        });
    }
}
