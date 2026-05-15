import {inject} from "@angular/core";
import {CanActivateFn, Router} from '@angular/router';
import {AuthCookieService} from "../services/cookies/auth-cookie.service";


export const authGuard: CanActivateFn = (route, state) => {
  let cookiesService = inject(AuthCookieService);
  const router = inject(Router);
  const token = cookiesService.get("reelyx_token");

  // le mando al login
  if (token){
    return true;
  }else {
    router.navigate(['/login']);
    return false;
  }

}
