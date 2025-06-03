export type ContractRequest = {
    id: string;
    referenceNumber: string;
    institution: string;
    signedDate: string;
    maturityDate: string;
    validUntilDate: string;
    clientId: number;
    managerId: number;
    advisorsIds: number[];
};