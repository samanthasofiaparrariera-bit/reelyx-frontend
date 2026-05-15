import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { PeliculasService } from '../../core/services/peliculas/peliculas.service';
import { ReviewsService } from '../../core/services/reviews/reviews.service';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-film-detail',
  imports: [
    FormsModule

  ],
  templateUrl: './film-detail.html',
  styleUrl: './film-detail.scss',
})
export class FilmDetail {
  peli = signal<any>(null);
  reviews: any;
  mostrarFormularioReview = false;
  textoReview = '';
  ratingReview = '';

  constructor(
    private peliculasService: PeliculasService, private reviewsService: ReviewsService, private router: Router
  ) {
    const nombre = sessionStorage.getItem('film_detail_name');

    this.peliculasService.cargarPeliculas();
    const lista = this.peliculasService.getFilm();

    setTimeout(() => {
      const encontrada = lista().find((p: any) =>
        p.name === nombre
      );
      this.peli.set(encontrada ?? null);
    }, 500);
    this.reviewsService.cargarReviews();
    this.reviews = this.reviewsService.getReviews();
  }

  estaLogueado() {
    return document.cookie.includes('reelyx_token');
  }

  reviewsPelicula() {
    return this.reviewsDePeliculaSinLimite().slice(0, 3);
  }

  irReviewsPelicula() {
    if (!this.peli()) {
      return;
    }
    sessionStorage.setItem('film_reviews_name', this.peli().name);
    this.router.navigate(['/film-reviews']);
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
  // navigate para perfil
  irPerfil(email: string) {
    sessionStorage.setItem('profile_email', email);
    this.router.navigate(['/profile']);
  }

  //   En caso de que no haya suficientes reviews
  reviewsDePeliculaSinLimite() {
    if (!this.peli() || !this.reviews) {
      return [];
    }

    return this.reviews().filter((review: any) =>
      review.name === this.peli().name
    );
  }

  toggleReviewForm() {
    this.mostrarFormularioReview = !this.mostrarFormularioReview;
  }

  // **********
  // Añadir Reviews

  guardarReview() {

    const data = {
      pelicula: this.peli().id,
      texto: this.textoReview,
      puntuacion: this.ratingReview
    };

    this.reviewsService.crearReview(data).subscribe({
      next: () => {
        this.textoReview = '';
        this.ratingReview = '';
        this.mostrarFormularioReview = false;

        this.reviewsService.recargarReviews();
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

}
