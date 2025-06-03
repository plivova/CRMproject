'use client'
import { useRouter } from "next/navigation";
import InlineButtonGroup from "@/app/components/inlineButtonGroup";

type TableRow = {
    id: string;
    name: string;
    email: string;
};

interface PeopleOverviewTableProps {
    data: TableRow[];
    type: 'client' | 'advisor';
    onRefresh?: () => void;
}

export default function PeopleOverviewTable({ data, type, onRefresh }: PeopleOverviewTableProps) {
    const router = useRouter();

    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <button
                type="button"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none
              focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center
              dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mb-4"
                onClick={() => router.push(`/${type}s/add`)}
            >
                Add {type}
            </button>

            {data.length === 0 ? (
                <p className="text-l font-bold my-4">
                    No {type}s yet
                </p>
            ) : (
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">Name</th>
                        <th scope="col" className="px-6 py-3">Email</th>
                        <th scope="col" className="px-6 py-3"></th>
                    </tr>
                    </thead>
                    <tbody>
                    {data.map((person) => (
                        <tr
                            key={person.id}
                            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer"
                            onClick={() => router.push(`/${type}s/${person.id}`)}
                        >
                            <th
                                scope="row"
                                className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
                            >
                                <div className="ps-3">
                                    <div className="text-base font-semibold">{person.name}</div>
                                </div>
                            </th>
                            <td className="px-6 py-4">{person.email}</td>
                            <td className="px-6 py-4 text-right" onClick={e => e.stopPropagation()}>
                                <InlineButtonGroup
                                    type={type}
                                    data={person}
                                    onDeleteSuccess={() => {
                                        if (onRefresh) {
                                            onRefresh();
                                        }
                                    }}
                                />
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}