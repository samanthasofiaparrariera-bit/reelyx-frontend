import { HttpInterceptorFn } from '@angular/common/http';
import Swal from 'sweetalert2';
import { finalize } from 'rxjs';

let peticionesActivas = 0;

// el interceptor recibe mi http.get() y carga el sweet alert
export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  if (
    req.url.includes('/api/users/register/') ||
    req.url.includes('/api/users/verify-code/') ||
    (req.url.includes('/api/reviews/') && req.method === 'POST')
  ) {
    return next(req);
  }

  peticionesActivas++;

  if (peticionesActivas === 1) {
    Swal.fire({
      title: 'Cargando...',
      text: 'Espere un momento',
      allowOutsideClick: false,
      showConfirmButton: false,
      background: '#131113',
      color: '#ffffff',
      didOpen: () => {
        Swal.showLoading();
      }
    });
  }
  // Cuando el service va a recibir la respuesta
  // Finalize se ejecuta incluso si la request da error
  return next(req).pipe(
    finalize(() => {
      peticionesActivas--;

      if (peticionesActivas === 0) {
        Swal.close();
      }
    })
  );
};
