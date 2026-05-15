import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ReviewsService } from '../../core/services/reviews/reviews.service';

@Component({
  selector: 'app-reviews',
  imports: [],
  templateUrl: './reviews.html',
  styleUrl: './reviews.scss',
})
export class Reviews {
  reviews: any;
  limiteReviews = 8;

  constructor(
    private reviewsService: ReviewsService,
    private router: Router
  ) {
    this.reviewsService.cargarReviews();
    this.reviews = this.reviewsService.getReviews();
  }

  // llevar al usuario a film detail
  irFilmDetail(nombre: string) {
    sessionStorage.setItem('film_detail_name', nombre);
    this.router.navigate(['/film-detail']);
  }

  // Me aseguro de que se envie bien la imagen del usuario
  getUserImage(review: any) {
    if (!review.pfp) {
      return '';
    }
    if (review.pfp.startsWith('http')) {
      return review.pfp;
    }

    return `http://localhost:8000${review.pfp}`;
  }

  reviewsLimitadas() {
    return this.reviews().slice(0, this.limiteReviews);
  }

  verMasReviews() {
    this.limiteReviews += 4;
  }

}
