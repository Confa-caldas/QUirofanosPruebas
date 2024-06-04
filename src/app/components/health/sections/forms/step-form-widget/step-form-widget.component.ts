import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-step-form-widget',
    templateUrl: './step-form-widget.component.html',
    styleUrls: ['./step-form-widget.component.scss']
})
export class StepFormWidgetComponent implements OnInit {

    @Input() styleSteps: number;
    @Input() numSteps: number;
    @Input() currentStep: number;

    constructor() { }

    ngOnInit() {

    }

}
