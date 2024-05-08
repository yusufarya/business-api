import { User } from "@prisma/client";

enum GenderType {
  M = "M",
  F = "F",
}

enum StatusActive {
  Y = "Y",
  N = "N",
}

export type UserResponse = {
  name: string;
  username: string;
  gender: string;
  place_of_birth?: string | null;
  date_of_birth?: Date | null;
  phone: string;
  address?: string | null;
  is_active: string;
  role_id: number;
  token?: string | null;
  last_login?: Date | null;
};

export type CreateUserRequest = {
  name: string;
  username: string;
  gender: GenderType;
  place_of_birth?: string;
  date_of_birth?: string;
  phone: string;
  address?: string;
  email: string;
  password: string;
  role_id: number;
  level: number;
  is_active: StatusActive;
  last_login?: Date;
  created_at?: Date;
  created_by?: string;
  updated_at?: Date;
  updated_by?: string;
};

export type LoginUserRequest = {
  username: string;
  password: string;
};

export type UpdateUserRequest = {
  name?: string;
  username?: string;
  gender?: GenderType;
  place_of_birth?: string;
  date_of_birth?: Date ;
  phone?: string;
  address?: string;
  email?: string;
  password?: string;
  role_id?: number;
  level?: number;
  is_active?: StatusActive;
  last_login?: Date;
  created_at?: Date;
  created_by?: string;
  updated_at?: Date;
  updated_by?: string;
};

// User dari package prisma (payload)
export function toUserResponse(user: User): UserResponse {
  return {
    name: user.name,
    username: user.username,
    gender: user.gender,
    place_of_birth: user.place_of_birth,
    date_of_birth: user.date_of_birth,
    address: user.address,
    phone: user.phone,
    role_id: user.role_id,
    is_active: user.is_active,
    last_login: user.last_login,
  };
}
