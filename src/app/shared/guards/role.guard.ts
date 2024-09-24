import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { UserRole } from 'src/app/dashboard/users/create-edit-users/create-edit-users.component';
import { AuthService } from 'src/app/services/auth.service';
import { RoleService } from 'src/app/services/role.service';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
    const roleService = inject(RoleService); // Using inject to access the service
    const router = inject(Router); // Using inject to access the router
    const authService = inject(AuthService); // Using inject to access the router

    const requiredRoles: UserRole[] = route.data['roles']; // Access roles from route data
    const userData: UserRole[] = authService.userSystemData.roles as UserRole[];

    console.log('requiredRoles', requiredRoles);

    // Check if the user has the required role(s)
    if (roleService.hasAnyRole(userData, requiredRoles)) {
        return true;
    } else {
        router.navigate(['/dashboard']); // Redirect if roles don't match
        return false;
    }
};
