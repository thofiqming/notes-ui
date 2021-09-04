jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { NotesService } from '../service/notes.service';
import { INotes, Notes } from '../notes.model';

import { NotesUpdateComponent } from './notes-update.component';

describe('Component Tests', () => {
  describe('Notes Management Update Component', () => {
    let comp: NotesUpdateComponent;
    let fixture: ComponentFixture<NotesUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let notesService: NotesService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [NotesUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(NotesUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(NotesUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      notesService = TestBed.inject(NotesService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const notes: INotes = { id: 456 };

        activatedRoute.data = of({ notes });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(notes));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const notes = { id: 123 };
        spyOn(notesService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ notes });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: notes }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(notesService.update).toHaveBeenCalledWith(notes);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const notes = new Notes();
        spyOn(notesService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ notes });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: notes }));
        saveSubject.complete();

        // THEN
        expect(notesService.create).toHaveBeenCalledWith(notes);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const notes = { id: 123 };
        spyOn(notesService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ notes });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(notesService.update).toHaveBeenCalledWith(notes);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
