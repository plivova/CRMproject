'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import toast from "react-hot-toast";
import ContractForm, { ContractFormDetails } from "@/app/components/contractForm";
import { createContract, deleteContract, updateContract, getContract } from "@/app/repositories/contractsRepository";
import { ContractRequest } from "@/app/models/contractRequest";
import PeopleList from "@/app/components/peopleList";

export type ContractViewData = {
    id: string;
    referenceNumber: string;
    institution: string;
    signedDate: string;
    maturityDate: string;
    validUntilDate: string;
    client: ContractClientViewData;
    advisors: ContractAdvisorViewData[];
    manager: ContractAdvisorViewData;
}

export type ContractAdvisorViewData = {
    id: string;
    name: string;
}

export type ContractClientViewData = {
    id: string;
    name: string;
}

export default function ContractDetailPage() {
    const {id} = useParams<{ id: string }>();
    const [contract, setContract] = useState<ContractViewData | null>(null);

    const router = useRouter();

    const fetchContract = useCallback(async () => {
        try {
            const contractViewData = await getContract(id);
            setContract(contractViewData)
        } catch {
            toast.error(`Failed to load contract ${id}`);
        }
    }, [id]);

    useEffect(() => {
        const controller = new AbortController();
        void fetchContract();
        return (() => {
            controller.abort();
        })
    }, [fetchContract]);

    if (!contract) return <p>Loading...</p>;

    const handleDelete = (id: string) => {
        toast.promise(
            deleteContract(id),
            {
                loading: "Deleting...",
                success: "Contract deleted!",
                error: "Failed to delete contract",
            }
        ).then(() => {
            router.push(`/contracts`); // refresh after deletion
            router.refresh();
        });
    };

    const handleSubmit = async (data: ContractFormDetails) => {
        try {
            const payload: Omit<ContractRequest, 'id'> = {
                referenceNumber: data.referenceNumber,
                institution: data.institution,
                signedDate: data.signedDate,
                maturityDate: data.maturityDate,
                validUntilDate: data.validUntilDate,
                clientId: Number(data.client.id),
                managerId: Number(data.manager.id),
                advisorsIds: data.advisors.map((a) => Number(a.id))
            };

            if (contract?.id) {
                await updateContract(contract.id, payload);
            } else {
                await createContract(payload);
            }

            toast.success("Contract saved!");
            router.push("/contracts");
            router.refresh();
        } catch (error) {
            console.error("Failed to save contract:", error);
            toast.error("Failed to save contract.");
        }
    };

    if (!contract) return <p>Loading...</p>;

    return (
        <>
            <ContractForm
                data={contract}
                onDelete={handleDelete}
                onSubmit={handleSubmit}
                isEditMode={true}
            />
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                    <PeopleList
                        data={contract.client}
                        heading="Client"
                        type="client"
                    />
                </div>
                <div className="flex-1">
                    <PeopleList
                        data={contract.manager}
                        heading="Manager"
                        type="advisor"
                    />
                </div>
            </div>

            <PeopleList
                data={contract.advisors}
                heading="Advisors"
                type="advisor"
            />
        </>
    );
}