import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './component/about/about.component';
import { EmptyComponent } from './component/empty/empty.component';
import { WorkComponent } from './component/work/work.component';
import { ContactComponent } from './component/contact/contact.component';
import { ComingsoonComponent } from './component/comingsoon/comingsoon.component';

const routes: Routes = [
	{ path: '', component: EmptyComponent },
	{ path: 'About', component: ComingsoonComponent },
	{ path: 'Work', component: ComingsoonComponent },
	{ path: 'Contact', component: ComingsoonComponent },
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
