import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const validarRangoFechas: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const inicio = control.get('fechaInicio')?.value;
  const fin = control.get('fechaFin')?.value;
  if (inicio && fin) {
    if (new Date(fin) < new Date(inicio)) {
      return { fechasInvalidas: true };
    }
  }
  return null;
};


export const mayorDe18: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const v = control.value;
  if (v === null || v === '') return null; // "required" cubre el vacío
  return Number(v) > 18 ? null : { menorDeEdad: true };
};