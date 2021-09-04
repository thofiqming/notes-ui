export interface INotes {
  id?: number;
  content?: string;
}

export class Notes implements INotes {
  constructor(public id?: number, public content?: string) {}
}

export function getNotesIdentifier(notes: INotes): number | undefined {
  return notes.id;
}
