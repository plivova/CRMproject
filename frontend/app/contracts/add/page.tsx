'use client'
import { useRouter } from "next/navigation";
import ContractForm, {ContractFormDetails} from "@/app/components/contractForm";
import { createContract } from "@/app/repositories/contractsRepository";
import toast from "react-hot-toast";

export default function AddContractPage() {
    const router = useRouter();

    const handleSubmit = async (data: ContractFormDetails) => {
        try {
            const payload = {
                referenceNumber: data.referenceNumber,
                institution: data.institution,
                signedDate: data.signedDate,
                maturityDate: data.maturityDate,
                validUntilDate: data.validUntilDate,
                clientId: parseInt(data.client.id),
                managerId: parseInt(data.manager.id),
                advisorsIds: data.advisors.map((a) => parseInt(a.id))
            };

            await createContract(payload);

            toast.success("Contract created!");
            router.push("/contracts");
            router.refresh();
        } catch (error) {
            console.error("Failed to submit contract:", error);
        }
    };

    return (
        <div>
            <ContractForm
                isEditMode={false}
                onSubmit={handleSubmit}
            />
        </div>
    )
}