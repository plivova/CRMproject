'use client'
import InlineButtonGroup from "@/app/components/inlineButtonGroup";
import {useRouter} from "next/navigation";

type TableRow = {
    id: string;
    referenceNumber: string;
    institution: string;
    signedDate: string;
    maturityDate: string;
    validUntilDate: string;
    client: string;
    manager: string;
};

interface ContractsTableProps {
    data: TableRow[];
    onRefresh?: () => void;
}

export default function ContractsOverviewTable({data, onRefresh}: ContractsTableProps) {
    const router = useRouter();

    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <button
                type="button"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none
              focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center
              dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mb-4"
                onClick={() => router.push(`/contracts/add`)}
            >
                Add contract
            </button>
            {data.length === 0 ? (
                <p className="text-l font-bold my-4">
                    No contracts yet
                </p>
            ) : (
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">Reference number</th>
                        <th scope="col" className="px-6 py-3">Institution</th>
                        <th scope="col" className="px-6 py-3">Client</th>
                        <th scope="col" className="px-6 py-3">Manager</th>
                        <th scope="col" className="px-6 py-3">Signed date</th>
                        <th scope="col" className="px-6 py-3"></th>
                    </tr>
                    </thead>
                    <tbody>
                    {data.map((contract) => (
                        <tr
                            key={contract.id}
                            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer"
                            onClick={() => router.push(`/contracts/${contract.id}`)}
                        >
                            <th
                                scope="row"
                                className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
                            >
                                <div className="ps-3">
                                    <div className="text-base font-semibold">{contract.referenceNumber}</div>
                                </div>
                            </th>
                            <td className="px-6 py-4">{contract.institution}</td>
                            <td className="px-6 py-4">{contract.client}</td>
                            <td className="px-6 py-4">{contract.manager}</td>
                            <td className="px-6 py-4">{contract.signedDate}</td>
                            <td className="px-6 py-4 text-right"
                                onClick={e => e.stopPropagation()} // prevent row click when clicking buttons
                            >
                                <InlineButtonGroup
                                    type={"contract"}
                                    data={contract}
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