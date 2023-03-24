import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { EmptyComponent } from './component/empty/empty.component';
import { HeaderComponent } from './component/header/header.component';
import { AboutComponent } from './component/about/about.component';

@NgModule({
	declarations: [
		AppComponent,
		EmptyComponent,
		HeaderComponent,
		AboutComponent,
	],
	imports: [BrowserModule, AppRoutingModule],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
