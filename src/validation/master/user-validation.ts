import { z, ZodType } from "zod";

const Gender = z.enum(['M', 'F']);
const IsActive = ["Y", "N"] as const;

export class UserValidation {
  
  static readonly REGISTER: ZodType = z.object({
    name: z.string({
      required_error: "Please enter your name"
    }).max(100).nonempty(),
    username: z.string({
      required_error: "Please enter your username"
    }).min(3).max(100),
    gender: Gender,
    place_of_birth: z.string().min(3).max(50).optional(),
    date_of_birth: z
      .date({
        required_error: "Please select a date and time",
        invalid_type_error: "That's not a date!",
      })
      .optional(),
    phone: z.string({
      required_error: "Please enter your phone"
    }).min(10).max(20),
    address: z.string().min(10).max(250).optional(),
    email: z.string().min(10).max(100),
    password: z.string().min(8).max(100),
    role_id: z.number().min(1).max(2).optional(),
    level: z.number().min(1).max(2).optional(),
    is_active: z.enum(IsActive).optional(),
    last_login: z
      .date({
        required_error: "Please select a date and time",
        invalid_type_error: "That's not a date!",
      })
      .optional(),
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
  });

  static readonly LOGIN: ZodType = z.object({
    username: z.string().min(1).max(100),
    password: z.string().min(1).max(100),
  });

  static readonly UPDATE: ZodType = z.object({
    name: z.string().min(3).max(100).optional(),
    username: z.string().min(3).max(100).optional(),
    gender: Gender.optional(),
    place_of_birth: z.string().min(3).max(50).optional(),
    date_of_birth: z
      .date({
        required_error: "Please select a date and time",
        invalid_type_error: "That's not a date!",
      })
      .optional(),
    phone: z.string().min(10).max(20).optional(),
    address: z.string().min(10).max(250).optional(),
    email: z.string().min(10).max(100).optional(),
    password: z.string().min(6).max(100).optional(),
    role_id: z.number().min(1).max(2).optional(),
    level: z.number().min(1).max(2).optional(),
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
