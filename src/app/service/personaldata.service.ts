import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class PersonaldataService {
	FirstName = 'Marino';
	Surname = 'Andriani';
	FullName = this.FirstName + ' ' + this.Surname;
	MotivationalPhrase = "Appassionato programmazione";
	constructor() {}
}
