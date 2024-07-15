import { Component } from '@angular/core';
import { AuthService, UserSystem } from '../../services/auth.service';

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
            this.userData.first_name +
            ' ' +
            this.userData.middle_name +
            ' ' +
            this.userData.last_name;

        this.shortName = `${
            this.userData.first_name?.charAt(0) +
            this.userData.middle_name?.charAt(0)
        }`;
    }
}

interface MenuItem {
    title: string;
    url: string;
    icon: string;
    roles?: string[];
}
