import { z, ZodType } from "zod";

export class BranchValidation {
    
    static readonly STORE: ZodType = z.object({
        name: z.string().min(3).max(100),
        phone: z.string().min(3).max(20),
        address: z.string().max(300).optional(),
        description: z.string().max(200).optional(),
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
        phone: z.string().min(3).max(20).optional(),
        address: z.string().max(300).optional(),
        description: z.string().optional(),
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