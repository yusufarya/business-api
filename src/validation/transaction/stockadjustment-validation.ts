import { z, ZodType } from "zod";

const typeAdjust = ["in", "out"] as const;

export class StockAdjustmentValidation {
    
    static readonly STORE: ZodType = z.object({
        date: z
        .date({
            required_error: "Please select a date and time",
            invalid_type_error: "That's not a date!",
        })
        .optional(),
        type: z.enum(typeAdjust),
        total_qty: z.number().optional(),
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
        number: z.string(),
        date: z
        .date({
            required_error: "Please select a date and time",
            invalid_type_error: "That's not a date!",
        }).optional(),
        type: z.enum(typeAdjust).optional(),
        total_qty: z.number().optional(),
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