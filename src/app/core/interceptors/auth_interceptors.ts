import {AuthCookieService} from "../services/cookies/auth-cookie.service";
import {inject} from "@angular/core";
import { HttpInterceptorFn } from '@angular/common/http';


export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const cookieService = inject(AuthCookieService)


    if ( req.url.includes('/api/users/login/') ||
    req.url.includes('/api/users/register/') ||
    req.url.includes('/api/peliculas/') ||
    req.url.includes('/api/users/public-profile/') ||
    (req.url.includes('/api/reviews/') && req.method === 'GET')||
    ( req.url.includes('/api/listas/' ) && req.method === 'GET') //el get es público pero el post solo te deja crear lista con un token
  ) { return next(req);
  }

  const token = cookieService.get("reelyx_token");
  req = req.clone({
    setHeaders:{
      "Authorization": token ? `Bearer ${token}` : "",
      "Accept": "application/json",
    }
  });

  return next(req);
};
