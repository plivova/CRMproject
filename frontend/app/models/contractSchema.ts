import { z } from "zod";

export const contractSchema = z.object({
    referenceNumber: z
        .string()
        .min(1, "Reference number is required"),

    institution: z
        .string()
        .min(1, "Institution name is required"),

    signedDate: z.coerce.date().max(new Date(), {
        message: "Signed date cannot be in the future",
    }),

    validUntilDate: z.coerce.date(),

    maturityDate: z.coerce.date(),

    client: z.object({
        id: z.string().min(1, "Client is required"),
        name: z.string(),
    }),

    manager: z.object({
        id: z.string().min(1, "Manager is required"),
        name: z.string(),
    }),

    advisors: z.array(z.object({
        id: z.string().min(1, "Advisor is required"),
        name: z.string(),
    })).min(1, "At least one advisor is required")
})
    .refine(
        (data) => data.validUntilDate >= data.signedDate,
        {
            path: ["validUntilDate"],
            message: "Valid until date must be after or equal to signed date",
        }
    )
    .refine(
        (data) =>
            data.maturityDate >= data.signedDate &&
            data.maturityDate <= data.validUntilDate,
        {
            path: ["maturityDate"],
            message: "Maturity date must be between signed and valid until date",
        }
    );