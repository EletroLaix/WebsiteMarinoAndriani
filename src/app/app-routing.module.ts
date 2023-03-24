import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './component/about/about.component';
import { EmptyComponent } from './component/empty/empty.component';

const routes: Routes = [
	{ path: '', component: EmptyComponent },
	{ path: 'About', component: AboutComponent },
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
