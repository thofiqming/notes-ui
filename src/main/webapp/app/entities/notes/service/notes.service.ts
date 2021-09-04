import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';

import {isPresent} from 'app/core/util/operators';
import {ApplicationConfigService} from 'app/core/config/application-config.service';
import {createRequestOption} from 'app/core/request/request-util';
import {getNotesIdentifier, INotes} from '../notes.model';
import {AppCryptoService} from "app/core/crypto/app-crypto.service";

export type EntityResponseType = HttpResponse<INotes>;
export type EntityArrayResponseType = HttpResponse<INotes[]>;

@Injectable({providedIn: 'root'})
export class NotesService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/notes');

  constructor(protected http: HttpClient,
              private applicationConfigService: ApplicationConfigService,
              private appCryptoService: AppCryptoService) {
  }

  async create(notes: INotes): Promise<EntityResponseType> {
    notes.content = await this.getEncryptedContent(notes).then(val => val);
    return this.http.post<INotes>(this.resourceUrl, notes, {observe: 'response'}).toPromise();
  }

  async update(notes: INotes): Promise<EntityResponseType> {
    notes.content = await this.getEncryptedContent(notes).then(val => val);
    return this.http.put<INotes>(`${this.resourceUrl}/${getNotesIdentifier(notes) as number}`, notes, {observe: 'response'}).toPromise();
  }

  async partialUpdate(notes: INotes): Promise<EntityResponseType> {
    notes.content = await this.getEncryptedContent(notes).then(val => val);
    return this.http.patch<INotes>(`${this.resourceUrl}/${getNotesIdentifier(notes) as number}`, notes, {observe: 'response'}).toPromise();
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<INotes>(`${this.resourceUrl}/${id}`, {observe: 'response'});
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<INotes[]>(this.resourceUrl, {params: options, observe: 'response'});
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, {observe: 'response'});
  }

  addNotesToCollectionIfMissing(notesCollection: INotes[], ...notesToCheck: (INotes | null | undefined)[]): INotes[] {
    const notes: INotes[] = notesToCheck.filter(isPresent);
    if (notes.length > 0) {
      const notesCollectionIdentifiers = notesCollection.map(notesItem => getNotesIdentifier(notesItem)!);
      const notesToAdd = notes.filter(notesItem => {
        const notesIdentifier = getNotesIdentifier(notesItem);
        if (notesIdentifier == null || notesCollectionIdentifiers.includes(notesIdentifier)) {
          return false;
        }
        notesCollectionIdentifiers.push(notesIdentifier);
        return true;
      });
      return [...notesToAdd, ...notesCollection];
    }
    return notesCollection;
  }

  async getEncryptedContent(notes: INotes): Promise<string> {
    const buffer = await this.appCryptoService.encryptMessage(notes.content);
    // const encryptedContent = new TextDecoder().decode(buffer);
    return btoa(String.fromCharCode.apply(null, Array.prototype.slice.call(new Uint8Array(buffer))));
  }

  async getDecryptedContent(notes: INotes): Promise<string> {
    let decodeContent = '';
    if (notes.content != null) {
      decodeContent = atob(notes.content);
    }
    return await this.appCryptoService.decryptMessage(decodeContent);
  }
}
