export class Entry {
  id: string;
  person_id: string;
  instant: string;
  action: string;

  constructor(id: string, person_id: string, instant: string, action: string) {
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
    return new Entry(data.id, data.person_id, data.instant, data.action);
  }

  // Helper to get a Date object from the instant string
  get date(): Date {
    return new Date(this.instant);
  }

  // Helper to check if the action is an entry
  get isEntry(): boolean {
    return (
      this.action.toLowerCase() === "entrada" ||
      this.action.toLowerCase() === "enter"
    );
  }

  // Helper to check if the action is an exit
  get isExit(): boolean {
    return (
      this.action.toLowerCase() === "salida" ||
      this.action.toLowerCase() === "exit"
    );
  }

  // Format the date in a readable format
  get formattedDate(): string {
    return new Date(this.instant).toLocaleDateString();
  }

  // Format the time in a readable format
  get formattedTime(): string {
    return new Date(this.instant).toLocaleTimeString();
  }
}
