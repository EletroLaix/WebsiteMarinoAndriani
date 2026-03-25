import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { EmptyComponent } from './component/empty/empty.component';
import { HeaderComponent } from './component/header/header.component';
import { AboutComponent } from './component/about/about.component';
import { WorkComponent } from './component/work/work.component';
import { ContactComponent } from './component/contact/contact.component';
import { ComingsoonComponent } from './component/comingsoon/comingsoon.component';

@NgModule({
	declarations: [
		AppComponent,
		EmptyComponent,
		HeaderComponent,
		AboutComponent,
		WorkComponent,
		ContactComponent,
		ComingsoonComponent,
	],
	imports: [BrowserModule, AppRoutingModule],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule { }
