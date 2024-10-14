import { z, ZodType } from "zod";

export class CategoryValidation {
    
    static readonly STORE: ZodType = z.object({
        name: z.string().min(3).max(100),
        description: z.string().max(200).optional(),
        image: z.string().max(200).optional(),
        created_at: z
        .date({
            required_error: "Please select a date and time",
            invalid_type_error: "That's not a date!",
        })
        .optional(),
        created_by: z.string().min(1).max(100).optional(),
        updated_at: z
        .date({
            required_error: "Please select a date and time",
            invalid_type_error: "That's not a date!",
        })
        .optional(),
        updated_by: z.string().min(1).max(100).optional(),
    })
    
    static readonly UPDATE: ZodType = z.object({
        id: z.number(),
        name: z.string().min(3).max(100).optional(),
        description: z.string().max(200).optional(),
        image: z.string().max(200).optional(),
        created_at: z
        .date({
            required_error: "Please select a date and time",
            invalid_type_error: "That's not a date!",
        })
        .optional(),
        created_by: z.string().min(1).max(100).optional(),
        updated_at: z
        .date({
            required_error: "Please select a date and time",
            invalid_type_error: "That's not a date!",
        })
        .optional(),
        updated_by: z.string().min(1).max(100).optional(),
    })
}