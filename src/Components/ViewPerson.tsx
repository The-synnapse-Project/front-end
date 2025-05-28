import { Person } from "@/models/Person";
import Image from "next/image";
import { ReactNode } from "react";

interface PictureProps {
  person: Person;
  children?: ReactNode;
}

export function Picture({ person }: PictureProps) {
  const initials =
    person.surname == null
      ? person.name.substring(0, 2).toUpperCase()
      : (
          person.name.substring(0, 1) + person.surname.substring(0, 1)
        ).toUpperCase();

  if (person.picture == null) {
    return (
      <div className="inline-block size-6 rounded-full ring-2 ring-white bg-blue">
        {initials}
      </div>
    );
  } else {
    return (
      <Image
        alt={person.name}
        className="inline-block size-6 rounded-full ring-2 ring-white"
        src={person.picture}
      />
    );
  }
}

export function PictureName({ person }: PictureProps) {
  return (
    <div className="flex gap-2">
      <Picture person={person} />
      <span>
        {person.name} {person.surname}
      </span>
    </div>
  );
}

export function PersonDesc({ person }: PictureProps) {
  return (
    <div className="flex min-w-0 gap-x-4">
      <Picture person={person} />
      <div className="min-w-0 flex-auto">
        <p className="text-sm/6 font-semibold text-gray-900">{person.name}</p>
      </div>
      <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
        <p className="text-sm/6 text-gray-900">
          {person.dateOfBirth?.toLocaleString()}
        </p>
        <p className="mt-1 text-xs/5 text-gray-500">{person.email}</p>
      </div>
    </div>
  );
}
