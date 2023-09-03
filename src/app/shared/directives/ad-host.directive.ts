import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[appAdHost]',
})
export class AdHostDirective {
    constructor(public viewContainerRef: ViewContainerRef) {}
}
