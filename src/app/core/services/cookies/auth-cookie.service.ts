import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CookieService} from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class AuthCookieService {
  constructor(private cookieService: CookieService) {
  }

  set(key: string, value: string,days: number = 7) {
    this.cookieService.set(key, value, days, "/", undefined, false, "Strict");
  }

  // aqui he usado lo mismo que en claseTienda
  // porque no se me ocurre otra forma de usar las cookies :(
  get(key: string) {
    return this.cookieService.get(key)
  }

  remove(key: string) {
    this.cookieService.delete(key, "/");
  }

  exists(key: string): boolean {
    return this.cookieService.check(key)
  }

  removeAll(): void {
    this.cookieService.deleteAll("/");
  }
}
