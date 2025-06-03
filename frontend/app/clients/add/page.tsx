'use client'
import PersonForm, {PersonFormDetails} from "@/app/components/personForm";
import { createClient } from "@/app/repositories/clientsRepository";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function AddClientPage() {
    const router = useRouter();

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

            await createClient(payload);

            toast.success("Client created!");
            router.push("/clients");
            router.refresh();
        } catch (error) {
            console.error("Failed to submit client:", error);
        }
    };

    return (
        <div>
            <PersonForm
            isEditMode={false}
            onSubmit={handleSubmit}
            type="client"/>
        </div>
    )
}