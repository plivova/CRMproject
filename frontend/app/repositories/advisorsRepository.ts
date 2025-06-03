import { apiInstance } from "@/app/api/axiosInstance";
import { AdvisorsViewData } from "@/app/advisors/page";
import { Advisor } from "@/app/models/advisor";
import { Contract } from "@/app/models/contract";
import { AdvisorViewData } from "@/app/advisors/[id]/page";

// GET advisors
export const getAdvisors = async () => {
    const res = await apiInstance.get('/Advisors');
    const advisors: AdvisorsViewData[] = res.data.map((advisor: Advisor) => {
        return {
            id: advisor.id.toString(),
            name: `${advisor.firstName} ${advisor.lastName}`,
            email: advisor.email
        }
    });
    return advisors;
}

// GET advisor by id
export const getAdvisor = async (id: string) => {
    const res = await apiInstance.get(`/Advisors/${id}`);
    const advisor: Advisor = res.data;
    const advisorViewData: AdvisorViewData = {
        id: advisor.id.toString(),
        firstName: advisor.firstName,
        lastName: advisor.lastName,
        email: advisor.email,
        phone: advisor.phone,
        birthNumber: advisor.birthNumber,
        age: advisor.age,
        contracts: advisor.contracts.map((contract: Contract) => {
            return {
                id: contract.id.toString(),
                referenceNumber: contract.referenceNumber,
                institution: contract.institution,
            }
        })
    }
    return advisorViewData
}

// DELETE advisor
export const deleteAdvisor = async (id: string) => {
    return await apiInstance.delete(`/Advisors/${id}`)
}

// CREATE advisor
export const createAdvisor = async (data: Omit<Advisor, 'id' | 'contracts'>) => {
    const res = await apiInstance.post('/Advisors', data);
    return res.data;
};

// UPDATE advisor
export const updateAdvisor = async (id: string, data: Omit<Advisor, 'id' | 'contracts'>) => {
    const res = await apiInstance.put(`/Advisors/${id}`, data);
    return res.data;
};

