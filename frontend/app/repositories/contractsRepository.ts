import { apiInstance } from "@/app/api/axiosInstance";
import { Contract } from "@/app/models/contract";
import { ContractsViewData } from "@/app/contracts/page";
import { ContractViewData } from "@/app/contracts/[id]/page";
import { Advisor } from "@/app/models/advisor";
import {ContractRequest} from "@/app/models/contractRequest";

// GET contracts
export const getContracts = async () => {
    const res = await apiInstance.get('/Contracts');
    const contracts: ContractsViewData[] = res.data.map((contract: Contract) => {
        return {
            id: contract.id.toString(),
            referenceNumber: contract.referenceNumber,
            institution: contract.institution,
            signedDate: contract.signedDate,
            maturityDate: contract.maturityDate,
            validUntilDate: contract.validUntilDate,
            client: `${contract.client?.firstName} ${contract.client?.lastName}`,
            manager: `${contract.manager?.firstName} ${contract.manager?.lastName}`,
        };
    });
    return contracts
}

// GET contract
export const getContract = async (id: string) => {
    const res = await apiInstance.get(`/Contracts/${id}`);
    const contract: Contract = res.data;
    const contractViewData: ContractViewData = {
        id: contract.id.toString(),
        referenceNumber: contract.referenceNumber,
        institution: contract.institution,
        signedDate: contract.signedDate,
        maturityDate: contract.maturityDate,
        validUntilDate: contract.validUntilDate,
        client: {
            id: contract.client?.id.toString() ?? "",
            name: `${contract.client?.firstName} ${contract.client?.lastName}`,
        },
        advisors: contract.advisors.map((advisor: Advisor) => {
            return {
                id: advisor.id.toString(),
                name: `${advisor.firstName} ${advisor.lastName}`,
            }
        }),
        manager: {
            id: contract.manager?.id.toString() ?? "",
            name: `${contract.manager?.firstName} ${contract.manager?.lastName}`,
        }
    }
    return contractViewData
}

// DELETE contract
export const deleteContract = async (id: string) => {
    return await apiInstance.delete(`/Contracts/${id}`)
}

// CREATE contract
export const createContract = async (data: Omit<ContractRequest, 'id'>) => {
    const res = await apiInstance.post('/Contracts', data);
    return res.data;
};

// UPDATE contract
export const updateContract = async (id: string, data: Omit<ContractRequest, 'id'>) => {
    const res = await apiInstance.put(`/Contracts/${id}`, data);
    return res.data;
};