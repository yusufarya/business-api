import { Unit, User } from "@prisma/client";
import { Request } from "express";

export interface UserRequest extends Request {
  user?: User;
}
export interface UnitRequest extends Request {
  unit?: Unit;
}
