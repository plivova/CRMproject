'use client'
import PersonForm, {PersonFormDetails} from "@/app/components/personForm";
import {useRouter} from "next/navigation";
import toast from "react-hot-toast";
import {createAdvisor} from "@/app/repositories/advisorsRepository";

export default function AddAdvisorPage() {
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

            await createAdvisor(payload);

            toast.success("Advisor created!");
            router.push("/advisors");
            router.refresh();
        } catch (error) {
            console.error("Failed to submit advisor:", error);
        }
    };
    return (
        <div>
            <PersonForm
                isEditMode={false}
                onSubmit={handleSubmit}
                type="advisor"/>
        </div>
    )
}