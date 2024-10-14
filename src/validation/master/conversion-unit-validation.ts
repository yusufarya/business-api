import { z, ZodType } from "zod";

export class ConversionUnitValidation {
    
    static readonly STORE: ZodType = z.object({
        product_id: z.number(),
        unit: z.string().max(3).optional(),
        conversion_unit: z.string().max(3),
        qty: z.number(),
        conversion_qty: z.number().optional(),
        purchase_price: z.number({
            required_error: "Purchase Price is required",
            invalid_type_error: "Purchase Price must be a number"
        }),
        selling_price: z.number({
            required_error: "Selling Price is required",
            invalid_type_error: "Selling Price must be a number"
        }),
        created_at: z
        .date({
            required_error: "Please select a date and time",
            invalid_type_error: "That's not a date!",
        })
        .optional(),
        created_by: z.string().max(100).optional(),
        updated_at: z
        .date({
            required_error: "Please select a date and time",
            invalid_type_error: "That's not a date!",
        })
        .optional(),
        updated_by: z.string().max(100).optional(),
    })
    
    static readonly UPDATE: ZodType = z.object({
        id: z.number(),
        product_id: z.number().optional(),
        unit: z.string().max(3).optional(),
        conversion_unit: z.string().max(3).optional(),
        qty: z.number().optional(),
        purchase_price: z.number({
            required_error: "Purchase Price is required",
            invalid_type_error: "Purchase Price must be a number"
        }).optional(),
        selling_price: z.number({
            required_error: "Selling Price is required",
            invalid_type_error: "Selling Price must be a number"
        }).optional(),
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