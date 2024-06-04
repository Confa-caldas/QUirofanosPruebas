import { Component, ViewEncapsulation, PLATFORM_ID, APP_ID, Inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, ActivatedRoute, NavigationEnd } from '@angular/router';

// declare google analytics
declare let ga: Function;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AppComponent {
    title = 'app';

    constructor(
        private translate: TranslateService,
        private router: Router,
        @Inject(PLATFORM_ID) private platformId: Object,
        @Inject(APP_ID) private appId: string
    ) {
        translate.setDefaultLang('es');
        translate.use('es');

        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                
                ga('set', 'page', event.urlAfterRedirects);
                ga('send', 'pageview');
            }
        });
    }

    useLanguage(language: string) {
        this.translate.use(language);
    }

    onActivate(event: any) {
        document.body.scrollTop = 0;
    }
}
