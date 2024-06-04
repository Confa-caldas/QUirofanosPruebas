import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class DocumentTypeService {

    constructor() { }

    getAll() {
        let data = [
            { id: 'C', name: 'Cédula de ciudadanía' },
            { id: 'E', name: 'Cédula de extranjería' },
            { id: 'P', name: 'Pasaporte' },
            { id: 'V', name: 'Permiso especial de permanencia' },
            { id: 'R', name: 'Registro civil' },
            { id: 'T', name: 'Tarjeta de identidad' },
        ];
        return data;

    }
}
