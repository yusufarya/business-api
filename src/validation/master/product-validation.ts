import { z, ZodType } from "zod";
const IsActive = ["Y", "N"] as const;
const YesOrNo = ["Y", "N"] as const;

export class ProductValidation {
    
    static readonly STORE: ZodType = z.object({
        name: z.string({
            required_error: "Product name is required",
            invalid_type_error: "Product name must be a string"
        })
        .max(100)
        .refine((value) => value.trim().length > 0, { message: "Name is required" }),
        category_id: z.number({
            required_error: "Category is required",
            invalid_type_error: "Category must be a number"
        }).max(5),
        unit_id: z.number({
            required_error: "Unit is required",
            invalid_type_error: "Unit must be a number"
        }).max(5),
        brand_id: z.number({
            required_error: "Brand is required",
            invalid_type_error: "Brand must be a number"
        }).max(5),
        barcode: z.string()
        .max(10, { message: "Barcode must be at most 10 characters long" })
        .optional(),
        min_stock: z.number({
            required_error: "Min Stock is required",
            invalid_type_error: "Min Stock must be a number"
        }),
        max_stock: z.number({
            required_error: "Max Stock is required",
            invalid_type_error: "Max Stock must be a number"
        }),
        purchase_price: z.number({
            required_error: "Purchase Price is required",
            invalid_type_error: "Purchase Price must be a number"
        }),
        selling_price: z.number({
            required_error: "Selling Price is required",
            invalid_type_error: "Selling Price must be a number"
        }),
        description: z.string().max(200).optional(),
        pos: z.enum(YesOrNo),
        image: z.string().max(200).optional(),
        is_active: z.enum(IsActive),
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
        name: z.string({
            required_error: "Product name is required",
            invalid_type_error: "Product name must be a string"
        })
        .max(100).optional(),
        category_id: z.number({
            required_error: "Category is required",
            invalid_type_error: "Category must be a number"
        }).max(5).optional(),
        unit_id: z.number({
            required_error: "Unit is required",
            invalid_type_error: "Unit must be a number"
        }).max(5).optional(),
        brand_id: z.number({
            required_error: "Brand is required",
            invalid_type_error: "Brand must be a number"
        }).max(5).optional(),
        barcode: z.string()
        .max(10, { message: "Barcode must be at most 10 characters long" })
        .optional(),
        min_stock: z.number({
            required_error: "Min Stock is required",
            invalid_type_error: "Min Stock must be a number"
        }).optional(),
        max_stock: z.number({
            required_error: "Max Stock is required",
            invalid_type_error: "Max Stock must be a number"
        }).optional(),
        purchase_price: z.number({
            required_error: "Purchase Price is required",
            invalid_type_error: "Purchase Price must be a number"
        }).optional(),
        selling_price: z.number({
            required_error: "Selling Price is required",
            invalid_type_error: "Selling Price must be a number"
        }).optional(),
        description: z.string().max(200).optional(),
        pos: z.enum(YesOrNo).optional(),
        image: z.string().max(200).optional(),
        is_active: z.enum(IsActive).optional(),
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