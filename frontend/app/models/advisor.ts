import { Contract } from "@/app/models/contract";
import { PersonBase } from "@/app/models/personBase";

export type Advisor = PersonBase & {
    id: string;
    contracts: Contract[];
}