import { Component, OnInit } from '@angular/core';
import { AuthService, UserSystem } from '../../services/auth.service';
import { UserRole } from '../users/create-edit-users/create-edit-users.component';
import { RoleService } from 'src/app/services/role.service';
import { Router, Scroll } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';

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
    isSmallScreen = false;
    isMenuOpen = false;
    MOBILE_RESOLUTION = 768;

    constructor(
        public authService: AuthService,
        public roleService: RoleService,
        private router: Router,
        private breakpointObserver: BreakpointObserver
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
        this.breakpointObserver
            .observe([
                `(max-width: ${this.MOBILE_RESOLUTION}px)`,
                `(min-width: ${this.MOBILE_RESOLUTION}px)`,
            ])
            .subscribe((result) => {
                if (
                    result.breakpoints[
                        `(max-width: ${this.MOBILE_RESOLUTION}px)`
                    ]
                ) {
                    this.isSmallScreen = result.matches;
                }
                if (
                    result.breakpoints[
                        `(min-width: ${this.MOBILE_RESOLUTION}px)`
                    ]
                ) {
                    this.isSmallScreen = false;
                    this.isMenuOpen = true;
                }
            });
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

    toggleMenu(): void {
        if (this.isSmallScreen) {
            this.isMenuOpen = !this.isMenuOpen;
        }
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
