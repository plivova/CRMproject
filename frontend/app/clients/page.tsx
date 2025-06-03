'use client'

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import PeopleOverviewTable from "@/app/components/peopleOverviewTable";
import { getClients } from "@/app/repositories/clientsRepository";

export type ClientsViewData = {
    id: string;
    name: string;
    email: string;
};

export default function ClientsPage() {
    const [clients, setClients] = useState<ClientsViewData[]>([]);

    const fetchClients = useCallback(async () => {
        try {
            const clients = await getClients()
            setClients(clients);
        } catch {
            toast.error("Failed to load clients");
        }
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        void fetchClients();
        return (() => {
            controller.abort();
        })
    }, [fetchClients]);

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Clients</h1>
            <PeopleOverviewTable
                data={clients}
                type="client"
                onRefresh={fetchClients}
            />
        </div>
    );
}
