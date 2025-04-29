
export class Person {
  name: string;
  surname?: string;
  dateOfBirth?: Date;
  picture?: string;
  email?: string;

  constructor(name: string) {
    this.name = name;
  }
}
