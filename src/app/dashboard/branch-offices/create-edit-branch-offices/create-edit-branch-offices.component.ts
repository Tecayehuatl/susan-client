import { Component } from '@angular/core';
import { states } from 'src/app/shared/states';

@Component({
    selector: 'app-create-edit-branch-offices',
    templateUrl: './create-edit-branch-offices.component.html',
    styleUrls: ['./create-edit-branch-offices.component.scss'],
})
export class CreateEditBranchOfficesComponent {
    states: any[];
    countries: any[];

    constructor() {
        this.states = states;
        this.countries = [{ value: 'MX', name: 'MÉXICO' }];
    }
}
