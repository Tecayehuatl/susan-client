import { Component } from '@angular/core';
import { AuthService, UserSystem } from '../../services/auth.service';
import { UserRole } from '../users/create-edit-users/create-edit-users.component';
import { RoleService } from 'src/app/services/role.service';

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
            requiredRoles: [
                UserRole.SUPER,
                UserRole.ADMIN,
                UserRole.OPERATOR,
                UserRole.CASHIER,
                UserRole.VIEWER,
            ],
        },
        {
            title: 'Pacientes',
            url: 'patients',
            icon: 'group',
            requiredRoles: [UserRole.SUPER, UserRole.ADMIN, UserRole.OPERATOR],
        },
        {
            title: 'Ordenes y cotizaciones',
            url: 'quotes',
            icon: 'list_alt',
            requiredRoles: [
                UserRole.SUPER,
                UserRole.ADMIN,
                UserRole.OPERATOR,
                UserRole.VIEWER,
            ],
        },
        {
            title: 'Doctores',
            url: 'doctors',
            icon: 'medication',
            requiredRoles: [UserRole.SUPER, UserRole.ADMIN],
        },
        {
            title: 'Estudios',
            url: 'studies',
            icon: 'science',
            requiredRoles: [UserRole.SUPER, UserRole.ADMIN],
        },
        {
            title: 'Sucursales',
            url: 'branch-offices',
            icon: 'apartment',
            requiredRoles: [UserRole.SUPER, UserRole.ADMIN],
        },
        {
            title: 'Descuentos',
            url: 'discounts',
            icon: 'redeem',
            requiredRoles: [UserRole.SUPER, UserRole.ADMIN],
        },
        {
            title: 'Usuarios',
            url: 'users',
            icon: 'supervisor_account',
            requiredRoles: [UserRole.SUPER],
        },
    ];

    userData!: UserSystem;
    shortName = '';
    fullName = '';
    userRoles: UserRole[] = [];

    constructor(
        public authService: AuthService,
        public roleService: RoleService,
    ) {
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
        this.userRoles = this.userData.roles as UserRole[];
    }
}

interface MenuItem {
    title: string;
    url: string;
    icon: string;
    requiredRoles: UserRole[];
}
