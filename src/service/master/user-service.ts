import env from "dotenv";
import { prismaClient } from "../../app/database";
import { ResponseError } from "../../error/response-error";
import {
  CreateUserRequest,
  LoginUserRequest,
  UpdateUserRequest,
  UserResponse,
  toUserResponse,
} from "../../model/master/user-model";
import { UserValidation } from "../../validation/master/user-validation";
import { Validation } from "../../validation/master/validation";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import { logger } from "../../app/logging";
import { User } from "@prisma/client";
import { Request } from "express";
import { Helper } from "../../utils/helper";

env.config();

const EXIST_USERNAME = process.env.EXIST_USERNAME;
const EXIST_EMAIL = process.env.EXIST_EMAIL;
const CREDENTIAL_ERROR = process.env.CREDENTIAL_ERROR;

export class UserService {
  static async getCurrentUser(req: Request): Promise<User|null> {
    logger.info(" ===== Get User Data =====");
    const getToken = req.headers.authorization; // Use 'authorization' instead of 'Authorization'

    logger.info(getToken);
    if (getToken) {
        try {
          const user = await prismaClient.user.findFirst({
              where: {
                  token: getToken,
              },
          });

          if (user) {
              return user;
          } else {
              console.error("User not found for token:", getToken);
              return null;
          }
        } catch (error) {
            console.error("Error retrieving user:", error);
            return null;
        }
    } else {
        console.error("No authorization token");
        return null; // Invalid token or token expired
    }
  }

  static async register(request: CreateUserRequest): Promise<UserResponse> {
    // logger.info('===== register =====')
    const registerRequest = Validation.validate(
      UserValidation.REGISTER,
      request
    );
    
    logger.info(registerRequest)

    const totalUserWithSchemaUsername = await prismaClient.user.count({
      where: {
        username: registerRequest.username,
      },
    });
    if (totalUserWithSchemaUsername != 0) {
      throw new ResponseError(400, EXIST_USERNAME!);
    }
    
    const totalUserWithSchemaEmail = await prismaClient.user.count({
      where: {
        email: registerRequest.email,
      },
    });
    if (totalUserWithSchemaEmail != 0) {
      throw new ResponseError(400, EXIST_EMAIL!);
    }

    const USER_DATA_REGISTER = {
      ...registerRequest,
      role_id : registerRequest.role_id ? registerRequest.role_id : 2,
      level : registerRequest.level ? registerRequest.level : 2,
      created_at : Helper.dateTimeLocal(new Date()),
      created_by : "self register",
      password : await bcrypt.hash(registerRequest.password, 10)
    }

    const user = await prismaClient.user.create({ 
      data: USER_DATA_REGISTER 
    });

    return toUserResponse(user);
  }

  static async login(request: LoginUserRequest): Promise<UserResponse> {
    const loginRequest = Validation.validate(UserValidation.LOGIN, request);
    let user = await prismaClient.user.findUnique({
      where: {
        username : loginRequest.username
      }
    })

    if(!user) {
      throw new ResponseError(401, CREDENTIAL_ERROR!)
    }

    const isPasswordValid = await bcrypt.compare(
      loginRequest.password,
      user.password
    )

    if(!isPasswordValid) {
      throw new ResponseError(401, CREDENTIAL_ERROR!)
    }

    user = await prismaClient.user.update({
      where: {
        username: loginRequest.username,
      },
      data: {
        token: uuid(),
        last_login: Helper.dateTimeLocal(new Date()),
      },
    });

    const response = toUserResponse(user);
    response.token = user.token!; // paksa tidak akan null
    return response;
  }

  static async get(user: User): Promise<UserResponse> {
    return toUserResponse(user)
  }

  static async update(user: User, request: UpdateUserRequest): Promise<UserResponse> {
    
    const requestWithParsedDateOfBirth = {
        ...request, // Copy other fields from the original request
        date_of_birth: request.date_of_birth ? new Date(request.date_of_birth) : null, // Parse the date_of_birth field
    };
    
    const updateRequest = Validation.validate(UserValidation.UPDATE, requestWithParsedDateOfBirth)

    if (updateRequest.name) {
      user.name = updateRequest.name;
    }
    if (updateRequest.username) {
      user.username = updateRequest.username;
    }
    if (updateRequest.gender) {
      user.gender = updateRequest.gender;
    }
    if (updateRequest.place_of_birth) {
      user.place_of_birth = updateRequest.place_of_birth;
    }
    if (updateRequest.date_of_birth) {
      user.date_of_birth = new Date(updateRequest.date_of_birth);
    }
    if (updateRequest.phone) {
      user.phone = updateRequest.phone;
    }
    if (updateRequest.address) {
      user.address = updateRequest.address;
    }
    if (updateRequest.email) {
      user.email = updateRequest.email;
    }
    if (updateRequest.password) {
      user.password = await bcrypt.hash(updateRequest.password, 10);
    }
    if (updateRequest.role_id) {
      user.role_id = updateRequest.role_id;
    }
    if (updateRequest.level) {
      user.level = updateRequest.level;
    }

    user.updated_at = Helper.dateTimeLocal(new Date());
    user.updated_by = "self update";

    const result = await prismaClient.user.update({
      where: {
        username : user.username
      },
      data : user
    })

    return toUserResponse(result);
  }

  static async logout(user: User): Promise<UserResponse> {
    const result = await prismaClient.user.update({
      where: {
        username: user.username,
      },
      data: {
        token: null,
      },
    });

    return toUserResponse(result);
  }

}
