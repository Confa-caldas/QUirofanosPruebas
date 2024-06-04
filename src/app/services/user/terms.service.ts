import { Injectable, EventEmitter, Output } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class TermsService {

    @Output() _callTerms: EventEmitter<boolean> = new EventEmitter();
    @Output() _acceptTerms: EventEmitter<boolean> = new EventEmitter();

    @Output() _callTermsService: EventEmitter<boolean> = new EventEmitter();
    @Output() _acceptTermsService: EventEmitter<boolean> = new EventEmitter();

    constructor() { }

    callTerms(res: boolean) {
        this._callTerms.emit(res);
    }

    acceptTerms(res: boolean) {
        this._acceptTerms.emit(res);
    }

    callTermsSevice(res: boolean){
        this._callTermsService.emit(res);
    }

    acceptTermsService(res: boolean){
        this._acceptTermsService.emit(res);
    }
}
