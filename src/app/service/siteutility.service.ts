import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Injectable({
	providedIn: 'root',
})
export class SiteutilityService {
	isHome = true;

	constructor(private Router: Router) {
		Router.events.subscribe((e) => {
			if (e instanceof NavigationEnd) {
				this.isHome = e.urlAfterRedirects == '/';
			}
		});
	}
}
