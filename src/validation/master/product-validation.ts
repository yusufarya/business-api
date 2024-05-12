import { z, ZodType } from "zod";

export class ProductValidation {
    
    static readonly STORE: ZodType = z.object({
        name: z.string().min(3).max(100),
        category_id: z.number().max(5),
        unit_id: z.number().max(5),
        brand_id: z.number().max(5),
        barcode: z.string().min(8).max(10).optional(),
        min_stock: z.number(),
        max_stock: z.number(),
        purchase_price: z.number(),
        selling_price: z.number(),
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
        category_id: z.number().optional(),
        unit_id: z.number().optional(),
        brand_id: z.number().optional(),
        name: z.string().min(3).max(100).optional(),
        barcode: z.string().min(8).max(10).optional(),
        min_stock: z.number().optional(),
        max_stock: z.number().optional(),
        purchase_price: z.number().optional(),
        selling_price: z.number().optional(),
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