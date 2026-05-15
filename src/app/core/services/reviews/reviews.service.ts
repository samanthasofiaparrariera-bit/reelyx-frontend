import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReviewsService {
  private http = inject(HttpClient);
  private API = 'http://localhost:8000/api/reviews';

  reviews = signal<any[]>([]);

  cargarReviews() {
    if (this.reviews().length > 0) {
      return;
    }
    this.http.get(`${this.API}/`).subscribe({
      next: (response: any) => {
        console.log("REVIEWS:", response)
        this.reviews.set(response.data);
      },

      error: (error: any) => {
        console.log(error);
      }
    } );
  }

  getReviews() {
    return this.reviews;

  }

  crearReview(data: any) {
    return this.http.post('http://localhost:8000/api/reviews/', data);
  }
  recargarReviews() {
    this.reviews.set([]);
    this.cargarReviews();
  }




}
