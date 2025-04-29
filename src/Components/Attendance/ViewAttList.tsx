import { AttList } from "@/models/attendance/AttList";
import { Person } from "@/models/Person";
import { PersonDesc } from "../ViewPerson";

interface PersonListProps {
  personList: Array<Person>;
}

export function ViewPersonList({ personList }: PersonListProps) {
  return (
    <ul role="list" className="divide-y divide-gray-100">
      {personList.map((person) => (
        <li key={person.name} className="flex justify-between gap-x-6 py-5">
          <PersonDesc person={person} />
        </li>
      ))}
    </ul>
  );
}

interface AttListProps {
  attList: AttList;
}

export default function ViewAttList({ attList }: AttListProps) {
  return (
    <>
      <h2>Present</h2>
      <ViewPersonList personList={Array.from(attList.present)} />
      <h2>Not Present</h2>
      <ViewPersonList personList={Array.from(attList.notPresent)} />
    </>
  );
}
