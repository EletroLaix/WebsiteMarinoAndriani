import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class PersonaldataService {
	FirstName = 'Marino';
	Surname = 'Andriani';
	FullName = this.FirstName + ' ' + this.Surname;
	MotivationalPhrase =
		"La perfezione non esiste ma esiste una tolleranza abbastanza piccola che da l'illusione della sua esistenza";
	constructor() {}
}
