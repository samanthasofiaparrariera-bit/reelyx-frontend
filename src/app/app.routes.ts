import { Routes } from '@angular/router';
import {TopBar} from './layouts/main-layout/components/top-bar/top-bar';

export const routes: Routes = [
  {

    path: '',
    loadComponent: () => import('./layouts/main-layout/main-layout').then(m => m.MainLayout),

    children:
    [
      {
        path: '',
        loadComponent: () =>import('./features/pagina-principal/pagina-principal').then(m => m.PaginaPrincipal)
      },
      {
        path: 'films',
        loadComponent:()=> import('./features/films/films').then(m => m.Films)

      },
      {
        path: 'reviews',
        loadComponent:()=> import('./features/reviews/reviews').then(m => m.Reviews)
      },
      {
        path: 'lists',
        loadComponent:() => import('./features/lists/lists').then(m => m.Lists)
      },
      {
        path: 'film-detail',
        loadComponent:() => import('./features/film-detail/film-detail').then(m => m.FilmDetail)
      },
      {
        path: 'profile',
        loadComponent: () => import('./features/profile/profile').then(m => m.Profile)
      },
      {
        path: 'list-detail',
        loadComponent: () => import('./features/list-detail/list-detail').then(m => m.ListDetail)
      }

      ]
  },
  {
    path: 'login',
    loadComponent: () =>import('./layouts/main-layout/components/login/login').then(m => m.Login)
  },
  {
    path: 'register',
    loadComponent:()=>import('./layouts/main-layout/components/register/register').then(m => m.Register)
  }

];
    // path: 'login',
    // loadComponent: () =>import('./features/login/login').then(m => m.Login),
    // children:[
    //   {
    //     path: 'pagina-principal',
    //     loadComponent: () =>import('./features/pagina-principal/pagina-principal').then(m => m.PaginaPrincipal),
    //
    //   }
    // ]




