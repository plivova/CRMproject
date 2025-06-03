import { z } from "zod";

export const personSchema = z.object({
    firstName: z
        .string()
        .min(1, "First name is required")
        .regex(/^[A-Za-zÁÉÍÓÚáéíóúČčŘřŠšŽžÝýĚěŮů]+$/, "First name can contain only letters"),

    lastName: z
        .string()
        .min(1, "Last name is required")
        .regex(/^[A-Za-zÁÉÍÓÚáéíóúČčŘřŠšŽžÝýĚěŮů]+$/, "Last name can contain only letters"),

    email: z.string().email("Invalid email"),

    phone: z
        .string()
        .regex(/^\d{9}$/, "Phone number must be 9 digits"),

    birthNumber: z
        .string()
        .regex(/^\d{10}$/, "Birth number must be 10 digits"),

    age: z
        .coerce.string()
        .regex(/^\d+$/, "Age must be a number")
});
