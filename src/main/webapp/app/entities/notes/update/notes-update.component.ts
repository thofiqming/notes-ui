import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {from, Observable} from 'rxjs';
import { finalize } from 'rxjs/operators';

import { INotes, Notes } from '../notes.model';
import { NotesService } from '../service/notes.service';

@Component({
  selector: 'jhi-notes-update',
  templateUrl: './notes-update.component.html',
})
export class NotesUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    content: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(3000)]],
  });

  constructor(protected notesService: NotesService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ notes }) => {
      this.updateForm(notes);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const notes = this.createFromForm();
    if (notes.id !== undefined) {
      this.subscribeToSaveResponse(from(this.notesService.update(notes)));
    } else {
      this.subscribeToSaveResponse(from(this.notesService.create(notes)));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<INotes>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(notes: INotes): void {
    this.editForm.patchValue({
      id: notes.id,
      content: notes.content,
    });
  }

  protected createFromForm(): INotes {
    return {
      ...new Notes(),
      id: this.editForm.get(['id'])!.value,
      content: this.editForm.get(['content'])!.value,
    };
  }
}
