import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private http = inject(HttpClient);
  private API = 'https://reelyx-backend-9nic.onrender.com/api/users/profile';

  profile = signal<any>(null);

  cargarProfile() {
    this.http.get(`${this.API}/`).subscribe({
      next: (response: any) => {
        console.log("PROFILE:", response);
        this.profile.set(response.data);
      },
      error: (error: any) => {
        console.log("ERROR PROFILE:", error);
      }
    });
   }
  //  diferencio perfiles publicos de personales

  cargarPerfilPublico(email: string) {
    this.http.get(`https://reelyx-backend-9nic.onrender.com/api/users/public-profile/${email}/`).subscribe({
      next: (response: any) => {
        console.log("PERFIL PUBLICO:", response);
        this.profile.set(response.data);
      },
      error: (error: any) => {
        console.log("ERROR PERFIL PUBLICO:", error);
      }
    });
  }

  getProfile() {
    return this.profile;
  }


}
