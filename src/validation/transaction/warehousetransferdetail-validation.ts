import { z, ZodType } from "zod";

export class WarehouseTransferDetailValidation {
    
    static readonly STORE: ZodType = z.object({
        number: z.string(),
        sequence: z.number().optional(),
        date: z
        .date({
            required_error: "Please select a date and time",
            invalid_type_error: "That's not a date!",
        })
        .optional(),
        qty: z.number(),
        product_id: z.number(),
        branch_id: z.number(),
        description: z.string().min(3).max(200).optional(),
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
        number: z.string(),
        sequence: z.number().optional(),
        date: z
        .date({
            required_error: "Please select a date and time",
            invalid_type_error: "That's not a date!",
        }).optional(),
        qty: z.number().optional(),
        product_id: z.number().optional(),
        branch_id: z.number().optional(),
        description: z.string().min(3).max(200).optional(),
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