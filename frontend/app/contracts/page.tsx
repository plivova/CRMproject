'use client'

import { useEffect, useState, useCallback } from "react";
import ContractsOverviewTable from "@/app/components/contractsOverviewTable";
import {getContracts} from "@/app/repositories/contractsRepository";

export type ContractsViewData = {
    id: string;
    referenceNumber: string;
    institution: string;
    signedDate: string;
    maturityDate: string;
    validUntilDate: string;
    client: string;
    manager: string;
};

export default function ContractsPage() {
    const [contracts, setContracts] = useState<ContractsViewData[]>([]);

    // useCallback to memoize the function and avoid re-creation on every render
    const fetchContracts = useCallback(async () => {
        try {
            const contracts: ContractsViewData[] = await getContracts()
            setContracts(contracts);
        } catch (error) {
            console.error("Error fetching contracts", error);
        }
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        void fetchContracts();
        return (() => {
            controller.abort();
        })
    }, [fetchContracts]);

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Contracts</h1>
            <ContractsOverviewTable
                data={contracts}
                onRefresh={fetchContracts} />
        </div>
    );
}
