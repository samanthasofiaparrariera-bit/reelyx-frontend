import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';


@Injectable({
  providedIn: 'root',
})
export class PeliculasService {

  private http = inject(HttpClient);
  private API = 'http://localhost:8000/api/peliculas';

 // guardamos las peliculas de django en pelis
  pelis = signal<any[]>([]);
  private cargadas = false;

  // TRAER PELIS DE DJANGO
  cargarPeliculas(){

    // con esto reviso si estan cargadas o no para no tener que pedirlas de nuevo
    if (this.pelis().length > 0) {
      return;
    }

    this.http.get(`${this.API}/`).subscribe({
      next: (response :any) => {
        console.log("Películas: ", response)
        console.log("PRIMERA IMAGEN:", response.data[0].imagen);
        this.pelis.set(response.data);
      },
        error: (error :any) => {
          console.log(error);
      }
   });
  }

//   DEVUELVO LAS PELIS QUE TENGO GUARDADAS
  getFilm(){
    return this.pelis;
  }
}

