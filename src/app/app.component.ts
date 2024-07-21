import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Gtag } from 'angular-gtag';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    constructor(private router: Router, private gtag: Gtag) {}

    ngOnInit() {
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                this.gtag.pageview({
                    page_path: event.urlAfterRedirects,
                });
            }
        });
    }
}
