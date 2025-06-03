import { Contract } from "@/app/models/contract";
import { PersonBase } from "@/app/models/personBase";

export type Client = PersonBase & {
    id: string;
    contracts: Contract[];
};