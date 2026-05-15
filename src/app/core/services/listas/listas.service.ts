import {Injectable, signal} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ListasService {

  private KEY = 'lista_selection_id';
  private MAX = 30;
  private API = 'https://reelyx-backend-9nic.onrender.com/api/listas';
  private idsSeleccionados = signal<string[]>([]);
  private http = inject(HttpClient);
  listas = signal<any[]>([]);

  constructor() {
    this.idsSeleccionados.set(this.getIds());
  }

  // Devolver ids
  private getIds(): string[] {
    const texto = sessionStorage.getItem(this.KEY);
    return texto ?  JSON.parse(texto):[]

  }
  // Guardar ids
  private saveIds(ids: string[]) {
    sessionStorage.setItem(this.KEY, JSON.stringify(ids));
    this.idsSeleccionados.set(ids);
  }
  //****

  cargarListas() {
    if (this.listas().length > 0) {
      return;
    }
    this.http.get(`${this.API}/`).subscribe({
      next: (response: any) => {
        console.log("LISTAS:", response);
        this.listas.set(response.data);
      },
      error: (error: any) => {
        console.log("ERROR LISTAS:", error);
      }
    });
  }

  quitarListaDeSignal(id: number) {
    const nuevasListas = this.listas().filter((lista: any) => lista.id !== id);
    this.listas.set(nuevasListas);
  }

  getListas() {
    return this.listas;
  }


  // revisa si esta en la lista o no
  seleccionado(id: string) {

    const ids = this.getIds();
    return this.idsSeleccionados().includes(id);

  }

  // Cuantas pelis hay
  count() {
    return this.idsSeleccionados().length;
  }
  // Vacia la tabla
  reset(){
    sessionStorage.removeItem(this.KEY);
    this.idsSeleccionados.set([]);
  }
  guardarLista(nombre: string) {
    const peliculas = this.getIds();

    return this.http.post(`${this.API}/`, {
      nombre: nombre,
      descripcion: "",
      peliculas: peliculas
    });
  }

  // Selección multiple sin superar el max (30)
  toggle(id: string) {
    const ids = this.getIds();

    // puse i porque me acorde del fori
    if (ids.includes(id)){
      const nuevos = ids.filter(i => i !== id);
      this.saveIds(nuevos);
      return
    }
    if (ids.length >= this.MAX) {
      alert('Máximo 30 pelis')
      return
    }
    ids.push(id)
    this.saveIds(ids)
  }

//   *************************
//   UPDATE LIST Y DELETE LIST
  actualizarLista(id: number, nombre: string, descripcion: string, peliculas: number[]) {
    return this.http.put(`${this.API}/${id}/`, {
      nombre: nombre,
      descripcion: descripcion,
      peliculas: peliculas
    });
  }

  eliminarLista(id: number) {
    return this.http.delete(`${this.API}/${id}/`);
  }

}
