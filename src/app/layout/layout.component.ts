import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

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
            title: 'Usuarios',
            url: 'users',
            icon: 'supervisor_account',
        },
    ];
    constructor(public authService: AuthService) {}
}

interface MenuItem {
    title: string;
    url: string;
    icon: string;
}
