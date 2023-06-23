import { Component } from '@angular/core';

@Component({
    selector: 'app-create-edit-patient',
    templateUrl: './create-edit-patient.component.html',
    styleUrls: ['./create-edit-patient.component.scss'],
})
export class CreateEditPatientComponent {
    foods: any[] = [
        { value: 'male', viewValue: 'Masculino' },
        { value: 'female', viewValue: 'Femenino' },
    ];
}
