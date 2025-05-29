export enum Action {
  Entry = "Entrada",
  Exit = "Salida",
}
export class Entry {
  id: string;
  person_id: string;
  instant: string;
  action: Action;

  constructor(id: string, person_id: string, instant: string, action: Action) {
    this.id = id;
    this.person_id = person_id;
    this.instant = instant;
    this.action = action;
  }

  // Factory method to create an Entry from API response
  static fromApiResponse(data: {
    id: string;
    person_id: string;
    instant: string;
    action: string;
  }): Entry {
    let action_enum = Action.Entry;
    switch (data.action.toLowerCase()) {
      case "entrada":
      case "enter":
        action_enum = Action.Entry;
        break;
      case "salida":
      case "exit":
        action_enum = Action.Exit;
        break;
    }
    return new Entry(data.id, data.person_id, data.instant, action_enum);
  }

  // Helper to get a Date object from the instant string
  get date(): Date {
    return new Date(this.instant);
  }

  // Helper to check if the action is an entry
  get isEntry(): boolean {
    return this.action === Action.Entry;
  }

  // Helper to check if the action is an exit
  get isExit(): boolean {
    return this.action === Action.Exit;
  }

  // Format the date in a readable format
  get formattedDate(): string {
    const date = new Date(this.instant);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  // Format the time in a readable format
  get formattedTime(): string {
    return new Date(this.instant).toLocaleTimeString();
  }
}
