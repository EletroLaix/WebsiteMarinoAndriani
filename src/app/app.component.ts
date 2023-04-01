import { Component } from '@angular/core';
import { SiteutilityService } from './service/siteutility.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.sass'],
})
export class AppComponent {
	constructor(public SiteUtility: SiteutilityService) {}
}
