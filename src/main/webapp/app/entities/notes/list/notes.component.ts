import {Component, OnInit} from '@angular/core';
import {HttpHeaders, HttpResponse} from '@angular/common/http';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {INotes} from '../notes.model';

import {ITEMS_PER_PAGE} from 'app/config/pagination.constants';
import {NotesService} from '../service/notes.service';
import {NotesDeleteDialogComponent} from '../delete/notes-delete-dialog.component';
import {ParseLinks} from 'app/core/util/parse-links.service';

@Component({
  selector: 'jhi-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit {
  notes: INotes[];
  isLoading = false;
  itemsPerPage: number;
  links: { [key: string]: number };
  page: number;
  predicate: string;
  ascending: boolean;
  details: INotes | undefined;

  constructor(protected notesService: NotesService, protected modalService: NgbModal, protected parseLinks: ParseLinks) {
    this.notes = [];
    this.itemsPerPage = ITEMS_PER_PAGE;
    this.page = 0;
    this.links = {
      last: 0,
    };
    this.predicate = 'id';
    this.ascending = true;
  }

  loadAll(): void {
    this.isLoading = true;

    this.notesService
      .query({
        page: this.page,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe(
        (res: HttpResponse<INotes[]>) => {
          this.isLoading = false;
          this.paginateNotes(res.body, res.headers);
        },
        () => {
          this.isLoading = false;
        }
      );
  }

  reset(): void {
    this.page = 0;
    this.notes = [];
    this.loadAll();
  }

  loadPage(page: number): void {
    this.page = page;
    this.loadAll();
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: INotes): number {
    return item.id!;
  }

  delete(notes: INotes): void {
    const modalRef = this.modalService.open(NotesDeleteDialogComponent, {size: 'lg', backdrop: 'static'});
    modalRef.componentInstance.notes = notes;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.reset();
      }
    });
  }

  selectRow(notes: INotes): void {
    // eslint-disable-next-line no-console
    this.details = notes;
  }

  protected sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected paginateNotes(data: INotes[] | null, headers: HttpHeaders): void {
    this.links = this.parseLinks.parse(headers.get('link') ?? '');
    if (data) {
      for (const d of data) {
        this.notes.push(d);
      }
    }
  }
}
