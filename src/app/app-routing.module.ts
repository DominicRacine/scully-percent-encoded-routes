import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SomeComponent } from './some/some.component';

const routes: Routes = [
  {path: ":name", component: SomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
