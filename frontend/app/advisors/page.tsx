'use client'

import {useCallback, useEffect, useState} from "react";
import toast from "react-hot-toast";
import PeopleOverviewTable from "@/app/components/peopleOverviewTable";
import {getAdvisors} from "@/app/repositories/advisorsRepository";

export type AdvisorsViewData = {
    id: string;
    name: string;
    email: string;
};

export default function AdvisorsPage() {
    const [advisors, setAdvisors] = useState<AdvisorsViewData[]>([]);

    const fetchAdvisors = useCallback(async () => {
        try {
            const advisors = await getAdvisors()
            setAdvisors(advisors);
        } catch {
            toast.error("Failed to load advisors");
        }
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        void fetchAdvisors();
        return (() => {
            controller.abort();
        })
    }, [fetchAdvisors]);


    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Advisors</h1>
            <PeopleOverviewTable
                data={advisors}
                type="advisor"
                onRefresh={fetchAdvisors}/>
        </div>
    );

}