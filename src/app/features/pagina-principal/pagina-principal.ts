import {Component, signal} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {PeliculasService} from '../../core/services/peliculas/peliculas.service';
import {ReviewsService} from '../../core/services/reviews/reviews.service';
import {AuthCookieService} from '../../core/services/cookies/auth-cookie.service';
// Proyecto: Reelyx
// Autora: Samantha Sofía Parra Riera
// Descripción: Componente encargado de mostrar la página principal de la aplicación.

@Component({
  selector: 'app-pagina-principal',
  imports: [
    RouterLink
  ],
  templateUrl: './pagina-principal.html',
  styleUrl: './pagina-principal.scss',
})
export class PaginaPrincipal {
  pelis: any;
  reviews: any;
  private guardadas: any[] | null = null;

  constructor(
    private peliculasService: PeliculasService, private reviewsService: ReviewsService,
    private router: Router, private authCookieService: AuthCookieService
  ) {
    this.peliculasService.cargarPeliculas();
    this.pelis = this.peliculasService.getFilm();
    this.reviewsService.cargarReviews();
    this.reviews = this.reviewsService.getReviews();
  }

  recomendacionesHoy() {
    // Obtenemos las películas cargadas para generar dos recomendaciones
    const lista = this.pelis();
    if (lista.length === 0) return [];

    if (this.guardadas) {
      return this.guardadas;
    }

    const elegidas: any[] = [];
    // Seleccionamos dos películas aleatorias sin repetir
    while (elegidas.length < 2) {
      const random = Math.floor(Math.random() * lista.length);
      const peli = lista[random];
      if (!elegidas.includes(peli)) {
        elegidas.push(peli);
      }
    }

    this.guardadas = elegidas;
    return this.guardadas;
  }

  rankingGanador() {
    // Ordenamos las películas por rating para obtener la mejor valorada
    const listaOrdenada = this.pelis().toSorted((a: any, b: any) => b.rating - a.rating);
    return listaOrdenada[0]
  }


  // Devolvemos las siguientes películas del ranking
  rankingpeliculas() {
    // Devolvemos una lista ordenada sin alterar la origianl
    const listaOrdenada = this.pelis().toSorted((a: any, b: any) => b.rating - a.rating);

    // Solo devolvemos las estas películas del ranking
    return listaOrdenada.slice(1, 4)

  }

  irFilmDetail(nombre: string) {
    sessionStorage.setItem('film_detail_name', nombre);
    this.router.navigate(['/film-detail']);
  }


  getReviewImage(review: any) {
    if (!review.imagen) {
      return '';
    }
    if (review.imagen.startsWith('http')) {
      return review.imagen;
    }


    return `https://reelyx-backend-9nic.onrender.com${review.imagen}`;
  }

  getPeliculaImage(pelicula: any) {
    if (!pelicula.imagen) {
      return '';
    }
    if (pelicula.imagen.startsWith('http')) {
      return pelicula.imagen;
    }
    return `https://reelyx-backend-9nic.onrender.com${pelicula.imagen}`;
  }


  getUserImage(review: any) {
    if (!review.pfp) {
      return '';
    }

    if (review.pfp.startsWith('http')) {
      return review.pfp;
    }

    return `https://reelyx-backend-9nic.onrender.com${review.pfp}`;
  }

  // Críticos destacados ***
  getReviewers() {
    const lista = this.reviews();

    const elegidos: any[] = [];

    lista.forEach((review: any) => {
      // Evitamos repetir usuarios en la sección de críticos destacados
      if (!elegidos.find(u => u.email === review.email)) {
        elegidos.push(review);
      }
    });

    return elegidos.slice(0, 4); // solo hago 4 tarjetas
  }

  getReviewsCount(email: string) {
    return this.reviews().filter((r: any) => r.email === email).length;
  }

  // Comprobamos si existe token para mostrar u ocultar contenido de registro
  usuarioLogeado(): boolean {
    return this.authCookieService.exists('reelyx_token');

  }

  irPerfil(email: string) {
    sessionStorage.setItem('profile_email', email);
    this.router.navigate(['/profile']);
  }

}
