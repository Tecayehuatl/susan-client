import { Injectable } from '@angular/core';
import { UserRole } from '../dashboard/users/create-edit-users/create-edit-users.component';

@Injectable({
    providedIn: 'root',
})
export class RoleService {
    constructor() {}

    // Assuming `userRoles` is an array of roles assigned to the user
    hasRole(userRoles: UserRole[], userRole: UserRole): boolean {
        return userRoles.includes(userRole);
    }

    // Check if user has one of multiple roles
    hasAnyRole(userRoles: UserRole[], roles: UserRole[]): boolean {
        return roles.some((r: UserRole) => userRoles.includes(r));
    }
}
