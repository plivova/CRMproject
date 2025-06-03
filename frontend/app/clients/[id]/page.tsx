'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import toast from "react-hot-toast";
import PersonForm, { PersonFormDetails } from "@/app/components/personForm";
import ContractsList from "@/app/components/contractsList";
import { createClient, deleteClient, getClient, updateClient } from "@/app/repositories/clientsRepository";

export type ClientViewData = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    birthNumber: string;
    age: string;
    contracts: ClientContractViewData[];
}

export type ClientContractViewData = {
    id: string;
    referenceNumber: string;
    institution: string;
};

export default function ClientDetailPage() {
    const { id } = useParams<{ id: string }>();
    const [client, setClient] = useState<ClientViewData | null>(null);

    const router = useRouter();

    const fetchClient = useCallback(async () => {
        try {
            const clientViewData = await getClient(id);
            setClient(clientViewData);
        } catch {
            toast.error(`Failed to load client ${id}`);
        }
    }, [id]);

    useEffect(() => {
        const controller = new AbortController();
        void fetchClient();
        return (() => {
            controller.abort();
        })
    }, [fetchClient]);

    if (!client) return <p>Loading...</p>;

    const handleDelete = (id: string) => {
        toast.promise(
            deleteClient(id),
            {
                loading: "Deleting...",
                success: "Client deleted!",
                error: "Failed to delete client",
            }
        ).then(() => {
            router.push(`/clients`); // refresh after deletion
            router.refresh();
        });
    };

    const handleSubmit = async (data: PersonFormDetails) => {
        try {
            const payload = {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                phone: data.phone,
                birthNumber: data.birthNumber,
                age: data.age,
            };

            if (client.id) {
                await updateClient(client.id, payload);
            } else {
                await createClient(payload);
            }

            toast.success("Client saved!");
            router.push("/clients");
            router.refresh();
        } catch (error) {
            console.error("Failed to submit client:", error);
        }
    };

  return (
        <>
            <PersonForm
                data={client}
                onDelete={handleDelete}
                isEditMode={true}
                onSubmit={handleSubmit}
                type="client"
            />
            <ContractsList
                contracts={client.contracts}
                heading="Client's contracts"
                noContractsMessage="This client has no contracts."
            />
        </>
    );
}