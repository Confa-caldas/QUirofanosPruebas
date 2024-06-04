import { Component, OnInit } from '@angular/core';

// such override allows to keep some initial values

@Component({
    selector: 'app-frequent-questions',
    templateUrl: './frequent-questions.component.html',
    styleUrls: ['./frequent-questions.component.scss'],
})
export class FrequentQuestionsComponent implements OnInit {

    customClass = 'cf-accordion';
    isFirstOpen = true;
    oneAtATime: boolean = true;

    collection = [];


    constructor() { }

    ngOnInit() {

        this.loadList();

    }

    loadList() {

        const _collection = [
        
           
        ];

        this.collection = _collection;

    }

}
