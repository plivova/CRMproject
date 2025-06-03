'use client'

import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import PersonForm, { PersonFormDetails } from "@/app/components/personForm";
import toast from "react-hot-toast";
import { createAdvisor, deleteAdvisor, getAdvisor, updateAdvisor } from "@/app/repositories/advisorsRepository";
import ContractsList from "@/app/components/contractsList";

export type AdvisorViewData = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    birthNumber: string;
    age: string;
    contracts: AdvisorContractsViewData[];
};

export type AdvisorContractsViewData = {
    id: string;
    referenceNumber: string;
    institution: string;
};

export default function AdvisorDetailPage() {
    const { id } = useParams<{ id: string }>();
    const [advisor, setAdvisor] = useState<AdvisorViewData | null>(null);

    const router = useRouter();

    const fetchAdvisor = useCallback(async () => {
        try {
            const advisorViewData = await getAdvisor(id);
            setAdvisor(advisorViewData)
        } catch {
            toast.error(`Failed to load contract ${id}`);
        }
    }, [id]);

    useEffect(() => {
        const controller = new AbortController();
        void fetchAdvisor();
        return (() => {
            controller.abort();
        })
    }, [fetchAdvisor]);

    if (!advisor) return <p>Loading...</p>;

    const handleDelete = (id: string) => {
        toast.promise(
            deleteAdvisor(id),
            {
                loading: "Deleting...",
                success: "Advisor deleted!",
                error: "Failed to delete advisor",
            }
        ).then(() => {
            router.push(`/advisors`); // refresh after deletion
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

            if (advisor.id) {
                await updateAdvisor(advisor.id, payload);
            } else {
                await createAdvisor(payload);
            }

            toast.success("Advisor saved!");
            router.push("/advisors");
            router.refresh();
        } catch (error) {
            console.error("Failed to submit advisor:", error);
        }
    };

    return (
        <>
            <PersonForm
                data={advisor}
                onDelete={handleDelete}
                isEditMode={true}
                onSubmit={handleSubmit}
                type="advisor"
            />
            <ContractsList
                contracts={advisor.contracts}
                heading="Advisor's Contracts"
                noContractsMessage="This advisor has no contracts."
            />
        </>
    );
}