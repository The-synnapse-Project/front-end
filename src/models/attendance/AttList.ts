import { Person } from "../Person";


export class AttList {
  private _present: Set<Person>
  private _notPresent: Set<Person>

  constructor(present?: Array<Person>, notPresent?: Array<Person>) {
    this._present = new Set(present);
    this._notPresent = new Set(notPresent);
  }

  addPresent(person: Person) {
    if (this._notPresent.has(person)) {
      this._notPresent.delete(person);
    }

    this._present.add(person);
  }

  addNotPresent(person: Person) {
    if (this._present.has(person)) {
      this._present.delete(person);
    }

    this._notPresent.add(person);
  }

  delete(person: Person): boolean {
    return this._present.delete(person) || this._notPresent.delete(person);
  }

  has(person: Person): boolean {
    return this._present.has(person) || this._notPresent.has(person);
  }

  get present(): Set<Person> {
    return this._present;
  }

  get notPresent(): Set<Person> {
    return this._notPresent;
  }
}
