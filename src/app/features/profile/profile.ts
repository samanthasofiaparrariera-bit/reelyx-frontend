import {Component} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {ProfileService} from '../../core/services/profile/profile.service';
import {CommonModule} from '@angular/common';
import {ListasService} from '../../core/services/listas/listas.service';
import {ReviewsService} from '../../core/services/reviews/reviews.service';
import Swal from 'sweetalert2';
import {Router} from '@angular/router';
// Proyecto: Reelyx
// Autora: Samantha Sofía Parra Riera
// Descripción: Componente encargado de mostrar y editar perfiles de usuario.

@Component({
  selector: 'app-profile',
  imports: [
    CommonModule,
    FormsModule,

  ],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  profile: any;
  modoEditar = false
  listasUsuario: any;
  reviewsUsuario: any;
  limiteReviews = 3;
  // Puede guardar un file o nada, comienza en null.
  selectedFile: File | null = null;
  // Uso esta variable para mostrar una preview antes de enviarla.
  previewImage: string = '';
  esPerfilPublico = false;

  constructor(private profileService: ProfileService,
              private listasService: ListasService, private reviewsService: ReviewsService,
              private http: HttpClient, private router: Router) {

    // Comprobamos si el usuario está entrando a un perfil público o no
    const emailPublico = sessionStorage.getItem('profile_email');

    if (emailPublico) {
      // Cargamos el perfil público seleccionado desde reviews o desde listas
      this.profileService.cargarPerfilPublico(emailPublico);
      this.esPerfilPublico = true;
    } else {
      // Si no hay perfil público, cargamos el perfil del usuario logueado
      this.profileService.cargarProfile();
      this.esPerfilPublico = false;
    }

    this.profile = this.profileService.getProfile();

    this.listasService.cargarListas();
    this.listasUsuario = this.listasService.getListas();

    this.reviewsService.cargarReviews();
    this.reviewsUsuario = this.reviewsService.getReviews();
  }

  getPeliculaImage(peli: any) {
    if (!peli.imagen) {
      return '';
    }

    if (peli.imagen.startsWith('http')) {
      return peli.imagen;
    }

    return `http://localhost:8000${peli.imagen}`;
  }

  // on off
  toggleEditar() {
    this.modoEditar = !this.modoEditar;
  }

  getProfileImage() {
    if (this.previewImage) {
      return this.previewImage;
    }
    const user = this.profile();

    if (!user || !user.image) {
      return '';
    }
    if (user.image.startsWith('http')) {
      return user.image;
    }
    return `http://localhost:8000${user.image}`;
  }

  // Para que solo muestre mis reviews
  misReviews() {
    if (!this.profile() || !this.reviewsUsuario) {
      return [];
    }
    //que coincida con el email
    return this.reviewsUsuario().filter((review: any) =>
      review.email === this.profile().email
    );
  }

  // Para que solo muestre mis listas
  misListas() {
    if (!this.profile() || !this.listasUsuario) {
      return [];
    }
  // Filtramos solo las listas del perfil mostrado
    return this.listasUsuario().filter((lista: any) =>
      lista.usuario_email === this.profile().email
    );
  }

//   tendré la cantidad de reviews limitadas para no sobrecargar el perfil ( de 3 en 3)
  misReviewsLimitadas() {
    return this.misReviews().slice(0, this.limiteReviews);
  }

  verMasReviews() {
    this.limiteReviews += 3;
  }

//   ******** para ir al film detail
  irFilmDetail(nombre: string) {
    sessionStorage.setItem('film_detail_name', nombre.trim());
    this.router.navigate(['/film-detail']);
  }

  irListDetail(id: number) {
    sessionStorage.setItem('list_detail_id', String(id));
    this.router.navigate(['/list-detail']);
  }


//   ********
//   Actualizar la foto de perfil

  onFileSelected(event: any) {
    // Leemos la imagen que ha seleccionado el user
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      // Creamos una vista previa de la imagen antes de subirla, mejorando la experiencia de usuario
      const reader = new FileReader();

      reader.onload = () => {
        this.previewImage = reader.result as string;
      }
      reader.readAsDataURL(file);
    }
  }

  // Usamos FormData para enviar texto e imagenes al backend
  guardarPerfil() {
    const formData = new FormData();

    formData.append('nombre', this.profile().nombre);
    formData.append('bio', this.profile().bio);

    // Si el usuario seleccionó una imagen, la añadimos al formulario
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }
    Swal.fire({
      title: 'Actualizando perfil',
      text: 'Subiendo imagen...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    // Enviamos los cambios del perfil al backend
    this.http.put('http://localhost:8000/api/users/profile/', formData)
      .subscribe({
        next: (res: any) => {
          Swal.fire({
            icon: 'success',
            title: 'Perfil actualizado',
            showConfirmButton: false,
            timer: 1500
          });


          this.modoEditar = false;
        },
        error: (err: any) => {
          Swal.fire({
            icon: 'error',
            title: 'Error al guardar',
            text: 'Inténtalo de nuevo',
          });
        }
      });
  }


}
