import { Component } from '@angular/core';
import { AuthService, UserSystem } from '../services/auth.service';

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent {
    public menu: MenuItem[] = [
        {
            title: 'Dashboard',
            url: '/dashboard',
            icon: 'home',
        },
        {
            title: 'Pacientes',
            url: 'patients',
            icon: 'group',
        },
        {
            title: 'Ordenes y cotizaciones',
            url: 'quotes',
            icon: 'list_alt',
        },
        {
            title: 'Doctores',
            url: 'doctors',
            icon: 'medication',
        },
        {
            title: 'Estudios',
            url: 'studies',
            icon: 'science',
        },
        {
            title: 'Sucursales',
            url: 'branch-offices',
            icon: 'apartment',
        },
        {
            title: 'Descuentos',
            url: 'discounts',
            icon: 'redeem',
        },
        {
            title: 'Usuarios',
            url: 'users',
            icon: 'supervisor_account',
        },
    ];

    userData!: UserSystem;
    shortName = '';
    fullName = '';

    constructor(public authService: AuthService) {
        this.userData = this.authService.userSystemData;
        this.fullName =
            this.userData.firstName +
            ' ' +
            this.userData.middleName +
            ' ' +
            this.userData.lastName;

        this.shortName = `${
            this.userData.firstName?.charAt(0)
                ? this.userData.middleName.charAt(0)
                : ''
        }`;
    }
}

interface MenuItem {
    title: string;
    url: string;
    icon: string;
}
