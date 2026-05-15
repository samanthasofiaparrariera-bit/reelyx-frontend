import {AbstractControl, ValidationErrors} from "@angular/forms";

export function EmailValidator(control: AbstractControl): null | ValidationErrors {

  const value = control.value;

  if (!value) {
    return null;
  }

  // Le pido que tenga al menos 4 caracteres de lo que sea

  const wholeMail = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;

  return wholeMail.test(value) ? null : {customEmail: true};

}



