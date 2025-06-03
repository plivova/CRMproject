import { apiInstance } from "@/app/api/axiosInstance";
import { Client } from "@/app/models/client";
import { Contract } from "@/app/models/contract";
import { ClientViewData } from "@/app/clients/[id]/page";
import { ClientsViewData } from "@/app/clients/page";

// GET all clients
export const getClients = async () => {
    const res = await apiInstance.get('/Clients');
    const clients: ClientsViewData[] = res.data.map((client: Client) => {
        return {
            id: client.id.toString(),
            name: `${client.firstName} ${client.lastName}`,
            email: client.email
        };
    });
    return clients;
}

// GET client by ID
export const getClient = async (id: string) => {
    const res = await apiInstance.get(`/Clients/${id}`);
    const client: Client = res.data;
    const clientViewData: ClientViewData = {
        id: client.id.toString(),
        firstName: client.firstName,
        lastName: client.lastName,
        email: client.email,
        phone: client.phone,
        birthNumber: client.birthNumber,
        age: client.age,
        contracts: client.contracts.map((contract: Contract) => {
            return {
                id: contract.id.toString(),
                referenceNumber: contract.referenceNumber,
                institution: contract.institution,
            }
        })
    }
    return clientViewData
}

// DELETE client
export const deleteClient = async (id: string) => {
    return await apiInstance.delete(`/Clients/${id}`)
}

// CREATE client
export const createClient = async (data: Omit<Client, 'id' | 'contracts'>) => {
    const res = await apiInstance.post('/Clients', data);
    return res.data;
};

// UPDATE client
export const updateClient = async (id: string, data: Omit<Client, 'id' | 'contracts'>) => {
    const res = await apiInstance.put(`/Clients/${id}`, data);
    return res.data;
};