'use client'
import { useRouter } from "next/navigation";

type Person = {
    id: string;
    name: string
};

interface PeopleListProps {
    data: Person | Person[];
    heading?: string;
    type: 'client' | 'advisor';
}

export default function PeopleList({ data, heading = "People", type }: PeopleListProps) {
    const router = useRouter();
    const people = Array.isArray(data) ? data : [data];

    const goToDetail = (id: string) => {
        router.push(`/${type}s/${id}`);
    };

    return (
        <div className="p-4">
            <h3 className="text-lg font-bold mb-2">{heading}</h3>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <tbody>
                    {people.map((person) => (
                        <tr
                            key={person.id}
                            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer"
                            onClick={() => goToDetail(person.id)}
                        >
                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                {person.name}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

