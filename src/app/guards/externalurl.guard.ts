import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ExternalurlGuard implements CanActivate {
  constructor(private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {


    /*   if (this.router.url === '/') {
  
        //window.location.href = route.data['externalUrl'];
        return true;
      } else {
        return false;
      } */

    return true;
  }
}
