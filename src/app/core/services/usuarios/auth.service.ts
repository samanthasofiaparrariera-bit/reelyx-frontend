import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private http = inject(HttpClient);
  private API = 'https://reelyx-backend-9nic.onrender.com ';

  registro(data:any){
    return this.http.post<any>(`${this.API}/register/`, data)
  }

  login(data: any) {
    return this.http.post(`${this.API}/login/`, data);
  }

  verificarCodigo(data: any) {
    return this.http.post<any>(`${this.API}/verify-code/`, data);
  }
}
