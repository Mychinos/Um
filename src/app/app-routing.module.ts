import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LeafletComponent } from './components/leaflet/leaflet.component';
import { MainComponent } from './components/main/main.component';

const routes: Routes = [
  {
    path: 'main/',
    component: MainComponent
  }, 
  {
    path: 'map/',
    component: LeafletComponent
  },
  {
    path: '**',
    component: MainComponent
  }, 

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
