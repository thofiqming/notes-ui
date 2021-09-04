import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { INotes } from '../notes.model';
import { NotesService } from '../service/notes.service';

@Component({
  templateUrl: './notes-delete-dialog.component.html',
})
export class NotesDeleteDialogComponent {
  notes?: INotes;

  constructor(protected notesService: NotesService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.notesService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
