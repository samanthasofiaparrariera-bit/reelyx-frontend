import {AbstractControl, ValidationErrors} from "@angular/forms";


export function checkPassValidator(control: AbstractControl): ValidationErrors | null {

    const value: string = control.value;

    if (!value) {
        return null;
    }

    const pass = /^(?=.*[A-Z])(?=.*\d).{6,}$/;

    const validate = pass.test(value);

    return validate ? null : {customPassword: true};

}

