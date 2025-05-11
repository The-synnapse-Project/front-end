export class Person {
  id?: string;
  name: string;
  surname?: string;
  dateOfBirth?: Date;
  picture?: string;
  email?: string;
  password_hash?: string; // Only used internally, never exposed to client

  constructor(
    name: string,
    options?: {
      id?: string;
      surname?: string;
      email?: string;
      dateOfBirth?: Date;
      picture?: string;
    },
  ) {
    this.name = name;

    if (options) {
      this.id = options.id;
      this.surname = options.surname;
      this.email = options.email;
      this.dateOfBirth = options.dateOfBirth;
      this.picture = options.picture;
    }
  }

  // Factory method to create a Person from API response
  static fromApiResponse(data: {
    id: string;
    name: string;
    surname: string;
    email: string;
    password_hash?: string;
  }): Person {
    const person = new Person(data.name, {
      id: data.id,
      surname: data.surname,
      email: data.email,
    });

    // Store password_hash only if needed for internal operations
    if (data.password_hash) {
      person.password_hash = data.password_hash;
    }

    return person;
  }
}
