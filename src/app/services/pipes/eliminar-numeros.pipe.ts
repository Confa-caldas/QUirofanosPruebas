import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'eliminarNumeros'
})
export class EliminarNumerosPipe implements PipeTransform {

  transform(value: string, args?: any): string {
    return value = value.replace(/[0-9]/g, '').trim();
  }

}
