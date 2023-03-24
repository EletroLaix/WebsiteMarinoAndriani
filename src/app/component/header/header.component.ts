import { Component } from '@angular/core';
import { PersonaldataService } from 'src/app/service/personaldata.service';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.sass'],
})
export class HeaderComponent {
	constructor(public PersonalData: PersonaldataService) {}
}
