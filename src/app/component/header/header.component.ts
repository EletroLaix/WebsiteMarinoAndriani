import { Component } from '@angular/core';
import { PersonaldataService } from 'src/app/service/personaldata.service';
import { SiteutilityService } from 'src/app/service/siteutility.service';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.sass', './navbar.component.sass'],
})
export class HeaderComponent {
	IsOpenMobileNavBar: boolean = false;

	constructor(
		public PersonalData: PersonaldataService,
		public SiteUtility: SiteutilityService
	) {}

	ChangeIsOpenMobileNavBar() {
		this.IsOpenMobileNavBar = !this.IsOpenMobileNavBar;
	}
}
