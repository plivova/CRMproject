'use client';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { deleteAdvisor } from "@/app/repositories/advisorsRepository";
import { deleteClient } from "@/app/repositories/clientsRepository";
import { deleteContract } from "@/app/repositories/contractsRepository";

type Person = {
    id: string;
    name: string;
};

type Contract = {
    id: string;
    referenceNumber: string;
    institution: string;
};

interface InlineButtonPropsBase {
    type: 'client' | 'advisor' | 'contract';
    onDeleteSuccess?: () => void;
}

interface ClientAdvisorProps extends InlineButtonPropsBase {
    type: 'client' | 'advisor';
    data: Person;
}

interface ContractProps extends InlineButtonPropsBase {
    type: 'contract';
    data: Contract;
}

type InlineButtonProps = ClientAdvisorProps | ContractProps;

export default function InlineButtonGroup({
                                              type,
                                              data,
                                              onDeleteSuccess,
                                          }: InlineButtonProps) {
    const router = useRouter();

    const handleDelete = () => {
        let itemName = '';

        if (type === 'contract') {
            itemName = `contract #${data.referenceNumber} (${data.institution})`;
        } else {
            // client or advisor
            itemName = data.name;
        }

        if (!window.confirm(`Are you sure you want to delete ${itemName}?`)) return;

        const deleteHandlers = {
            advisor: deleteAdvisor,
            client: deleteClient,
            contract: deleteContract,
        };

        const deleteHandler = deleteHandlers[type]

        toast.promise(
            deleteHandler(data.id),
            {
                loading: `Deleting ${type}...`,
                success: `${type.charAt(0).toUpperCase() + type.slice(1)} deleted!`,
                error: `Failed to delete ${type}`,
            }
        ).then(() => {
            if (onDeleteSuccess) {
                onDeleteSuccess();
            } else {
                router.push(`/${type}s`);
                router.refresh();
            }
        });
    };

    return (
        <div>
            <button
                className="font-medium text-blue-600 dark:text-blue-500 hover:underline px-2 cursor-pointer"
                onClick={() => router.push(`/${type}s/${data.id}`)}
            >
                Detail
            </button>
            <button
                className="font-medium text-red-500 dark:text-red-500 hover:underline px-2 cursor-pointer"
                onClick={handleDelete}
            >
                Delete
            </button>
        </div>
    );
}

