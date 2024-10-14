import { Component, OnInit } from '@angular/core';
import { AuthService, UserSystem } from '../../services/auth.service';
import { UserRole } from '../users/create-edit-users/create-edit-users.component';
import { RoleService } from 'src/app/services/role.service';
import { Router, Scroll } from '@angular/router';

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {
    public menu: MenuItem[] = [
        {
            title: 'Dashboard',
            url: '/dashboard',
            icon: 'home',
            isActiveUrl: false,
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
            isActiveUrl: false,
            requiredRoles: [UserRole.SUPER, UserRole.ADMIN, UserRole.OPERATOR],
        },
        {
            title: 'Ordenes',
            url: 'quotes',
            icon: 'list_alt',
            isActiveUrl: false,
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
            isActiveUrl: false,
            requiredRoles: [UserRole.SUPER, UserRole.ADMIN],
        },
        {
            title: 'Estudios',
            url: 'studies',
            icon: 'science',
            isActiveUrl: false,
            requiredRoles: [UserRole.SUPER, UserRole.ADMIN],
        },
        {
            title: 'Sucursales',
            url: 'branch-offices',
            icon: 'apartment',
            isActiveUrl: false,
            requiredRoles: [UserRole.SUPER, UserRole.ADMIN],
        },
        {
            title: 'Descuentos',
            url: 'discounts',
            icon: 'redeem',
            isActiveUrl: false,
            requiredRoles: [UserRole.SUPER, UserRole.ADMIN],
        },
        {
            title: 'Usuarios',
            url: 'users',
            icon: 'supervisor_account',
            isActiveUrl: false,
            requiredRoles: [UserRole.SUPER],
        },
    ];
    currentUrl = '';

    userData!: UserSystem;
    shortName = '';
    fullName = '';
    userRoles: UserRole[] = [];

    constructor(
        public authService: AuthService,
        public roleService: RoleService,
        private router: Router
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

    ngOnInit() {
        this.router.events.subscribe((event) => {
            if (event instanceof Scroll) {
                const moduleName =
                    event.routerEvent.urlAfterRedirects.split('/')[2];

                this.setisActiveClass(moduleName);
            }
        });
    }

    setisActiveClass(moduleName: string): void {
        this.menu.map((menuItem) => {
            if (menuItem.url === moduleName) {
                menuItem.isActiveUrl = true;
            } else {
                menuItem.isActiveUrl = false;
            }
        });
    }
}

interface MenuItem {
    title: string;
    url: string;
    icon: string;
    requiredRoles: UserRole[];
    isActiveUrl: boolean;
}
