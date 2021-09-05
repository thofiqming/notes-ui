import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'notes',
        data: { pageTitle: 'Notes' },
        loadChildren: () => import('./notes/notes.module').then(m => m.NotesModule),
      },
    ]),
  ],
})
export class EntityRoutingModule {}
