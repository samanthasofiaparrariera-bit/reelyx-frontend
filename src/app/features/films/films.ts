import {Component, signal} from '@angular/core';
import {NgClass} from '@angular/common';
import {PeliculasService} from '../../core/services/peliculas/peliculas.service';
import {ListasService} from '../../core/services/listas/listas.service';
import {Router} from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-films',
  imports: [
    NgClass
  ],
  templateUrl: './films.html',
  styleUrl: './films.scss',
})
export class Films {
  pelis: any;
  modoCrearLista = signal(false);
  confirmarLista = "Crear lista";
  ratingOptions = ['all', '1', '2', '3', '4', '5'];
  yearOptions = ['all', '2019', '2020', '2021', '2022', '2023', '2024', '2025'];
  genreOptions = ['all', 'sci_fi', 'romance', 'drama', 'accion', 'comedia', 'terror', 'aventura',
    'fantasia', 'animacion', 'documental', 'musical', 'thriller'];
  durationOptions = ['all', '1', '2', '3'];

  constructor(private peliculasService: PeliculasService, public listasService: ListasService,
              private router: Router) {

    this.peliculasService.cargarPeliculas();
    this.pelis = this.peliculasService.getFilm();
  }

  // FILTRO - DISPLAY
  dropdownOpen = signal<string>('');

  toggleMenu(name: string) {
    if (this.dropdownOpen() === name) {
      this.dropdownOpen.set('');
    } else {
      this.dropdownOpen.set(name);
    }
  }

  // FILTRO - APLICAR
  //  signals con valor all para q se muestren todas
  // Hacemos todos los filtros y luego hacemos un set
  filterYear = signal<string>('all')
  filterGenre = signal<string>('all')
  filterDuration = signal<string>('all')
  filterRating = signal<string>('all')

  filterByYear(year: string) {
    this.filterYear.set(year);
    this.dropdownOpen.set('');
  }

  filterByGenre(genre: string) {
    this.filterGenre.set(genre);
    this.dropdownOpen.set('');
  }

  filterByDuration(duration: string) {
    this.filterDuration.set(duration);
    this.dropdownOpen.set('');
  }

  filterByRating(rating: string) {
    this.filterRating.set(rating);
    this.dropdownOpen.set('');
  }

  resetFilter() {
    this.filterDuration.set('all')
    this.filterRating.set('all')
    this.filterGenre.set('all')
    this.filterYear.set('all')
    this.searchFilm.set('')
  }

//   FUNCIÓN PARA ENTRAR EN MODO CREAR LISTA Y SALIR
  toggleModoLista() {

    this.modoCrearLista.set(!this.modoCrearLista());
    // Aqui decide que texto mostrar en el botón
    if (this.modoCrearLista()) {
      this.confirmarLista = "CANCELAR"
    } else {
      this.confirmarLista = "CREAR LISTA"
      this.listasService.reset()
    }

  }

//   FUNCIÓN PARA QUE LEA CUANDO LE DOY CLICK A LA PELÍCULA
  clickPelicula(peli: any) {
    if (this.modoCrearLista()) {
      this.listasService.toggle(String(peli.id))
      return
    } else {
      sessionStorage.setItem('film_detail_name', peli.name);
      this.router.navigate(['/film-detail'])
    }
  }

  // GUARDAR LISTA
  async guardarLista() {
    const nombraLista = await Swal.fire({
      title: 'Nombre de la lista:',
      input: 'text',
      inputPlaceholder: 'Escribe el nombre de la lista...',
      background: '#151315',
      color: '#ffffff',
      confirmButtonColor: '#884aff',
      confirmButtonText: 'Crear lista',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',

      inputValidator: (value) => {
        if (!value) {
          return 'Debes escribir un nombre';
        }
        return null;
      }
    });
    // Si no tiene nombre no se guarda
    if (!nombraLista.isConfirmed) {
      return;
    }

    const nombre = nombraLista.value;

    this.listasService.guardarLista(nombre).subscribe({
      next: (response: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Lista guardada',
          text: '¡Tu lista se ha creado correctamente!',
          background: '#151315',
          color: '#ffffff',
          confirmButtonColor: '#884aff',
          timer: 3000,
          timerProgressBar: true,

        });
        console.log("GUARDADO, reseteando...");
        this.listasService.reset();
        this.modoCrearLista.set(false);
        this.confirmarLista = "Crear lista";
        console.log("modoCrearLista:", this.modoCrearLista())
      },
      error: (error: any) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se ha podido crear la lista...',
          background: '#151315',
          color: '#ffffff',
          confirmButtonColor: '#8b4cff'
        });
      }
    })
  }

  //   Si no estoy en modo crear lista, no sale nada seleccionado.
  estaSeleccionada(peli: any) {
    if (!this.modoCrearLista()) {
      return false;
    }
    return this.listasService.seleccionado(String(peli.id));
  }


// BUSCAR PELI
//   empieza vacia para que se vea todo y luego recibe el signal en lowercase
  searchFilm = signal<string>('');

  searchBar(buscado: string) {
    this.searchFilm.set(buscado);
  }

  protected readonly String = String;
}
