import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import * as _globals from '../../globals';

@Injectable({
    providedIn: 'root'
})
export class HealthAuthGuard implements CanActivate {

    constructor(
        public auth: AuthService,
        public router: Router
    ) { }

    canActivate(): boolean {
        if (!this.auth.isAuthenticated()) {
            this.router.navigate([_globals.main_health]);
            return false;
        }
        return true;
    }

    canActivateChild(): boolean {
        if (!this.auth.isAuthenticated()) {
            this.router.navigate([_globals.main_health]);
            return false;
        }
        return true;
    }

    canLoad(): boolean {
        if (!this.auth.isAuthenticated()) {
            this.router.navigate([_globals.main_health]);
            return false;
        }
        return true;
    }

}
