import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LocationsListComponent } from './containers/locations-list/locations-list.component';
import { LocationDetailsComponent } from './containers/location-details/location-details.component';

const routes: Routes = [
  {
    path: '',
    component: LocationsListComponent,
    data: {
      title: 'LOCATIONS.TITLE',
    },
  },
  { path: ':id', component: LocationDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LocationsRoutingModule {}
