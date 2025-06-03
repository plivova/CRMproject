'use client'
import { useRouter } from "next/navigation";
import InlineButtonGroup from "@/app/components/inlineButtonGroup";

type Contract = {
    id: string;
    referenceNumber: string;
    institution: string;
};

interface ContractsListProps {
    contracts: Contract[];
    heading?: string;
    noContractsMessage?: string;
}

export default function ContractsList({
                                          contracts,
                                          heading = "Contracts",
                                          noContractsMessage
                                      }: ContractsListProps) {

    const router = useRouter();

    const goToDetail = (id: string) => {
        router.push(`/contracts/${id}`);
    };

    if (contracts.length === 0) {
        return (
            <div className="p-4">
                <h3 className="text-lg font-bold mb-2">{heading}</h3>
                <p>{noContractsMessage}</p>
            </div>
        )
    } else {
    return (
        <div className="p-4">
           <h3 className="text-lg font-bold mb-2">{heading}</h3>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">Reference number</th>
                        <th scope="col" className="px-6 py-3">Institution</th>
                        <th scope="col" className="px-6 py-3"></th>
                    </tr>
                    </thead>
                    <tbody>
                    {contracts.map((contract) => (
                        <tr
                            key={contract.id}
                            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer"
                            onClick={() => goToDetail(contract.id)}
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

                            <td
                                className="px-6 py-4 text-right"
                                onClick={e => e.stopPropagation()} // prevent row click when clicking buttons
                            >
                                <InlineButtonGroup
                                    type={"contract"}
                                    data={contract}
                                    onDeleteSuccess={() => {
                                        router.refresh()
                                    }}
                                />
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    )}
}
