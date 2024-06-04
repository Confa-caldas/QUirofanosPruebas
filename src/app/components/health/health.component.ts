import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-health',
    templateUrl: './health.component.html',
    styleUrls: ['./health.component.scss']
})
export class HealthComponent {

    public loader: boolean = false;

    constructor(private router: Router) { }

    ngOnInit() {

    }

    onActivate(event: any) {
        document.body.scrollTop = 0;
    }
}
