import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { INotes } from '../notes.model';

@Component({
  selector: 'jhi-notes-detail',
  templateUrl: './notes-detail.component.html',
})
export class NotesDetailComponent implements OnInit {
  notes: INotes | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ notes }) => {
      this.notes = notes;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
