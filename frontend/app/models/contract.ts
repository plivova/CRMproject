import { Client } from "@/app/models/client";
import { Advisor } from "@/app/models/advisor";

export type Contract = {
    id: string;
    referenceNumber: string;
    institution: string;
    signedDate: string;
    maturityDate: string;
    validUntilDate: string;
    client: Client | null;
    advisors: Advisor[];
    manager: Advisor | null;
};