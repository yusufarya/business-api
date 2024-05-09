import env from "dotenv";
import { Branch, User } from "@prisma/client";
import { CreateBranchRequest, ByIdRequest, BranchResponse, UpdateBranchRequest, toBranchResponse } from "../model/branch-model";
import { prismaClient } from "../app/database";
import { Validation } from "../validation/validation";
import { BranchValidation } from "../validation/branch-validation";
import { logger } from "../app/logging";
import { ResponseError } from "../error/response-error";
import { Helper } from "../utils/helper";

env.config();

const DATA_NOT_FOUND = process.env.DATA_NOT_FOUND;

export class BranchService {
    static async getAllData(): Promise<Branch[]> {
        const result = await prismaClient.branch.findMany()

        return result
    }

    static async store(request: CreateBranchRequest, user: User): Promise<BranchResponse> {
        
        const branchRequest = Validation.validate(BranchValidation.STORE, request)

        logger.info("===== Store branch data =====")
        
        const existName = await prismaClient.branch.count({
            where:{
                name: branchRequest.name
            }
        })

        if(existName > 0) {
            throw new ResponseError(400, "Branch name already exists");
        }

        branchRequest.created_at = Helper.dateTimeLocal(new Date());
        branchRequest.created_by = user.username;
        
        const result = await prismaClient.branch.create({ 
            data: branchRequest
        });

        return toBranchResponse(result)
    }

    static async update(request: UpdateBranchRequest, user: User): Promise<BranchResponse> {
        
        const updateRequest = Validation.validate(BranchValidation.UPDATE, request)
        
        logger.info("===== Update branch data =====")
        logger.info(updateRequest)
        if(updateRequest.id) {
            const existdata = await prismaClient.branch.count({
                where:{
                    id: updateRequest.id
                }
            })
    
            if(existdata == 0) {
                throw new ResponseError(404, DATA_NOT_FOUND!);
            }
        }
        
        if(updateRequest.name) {
            const existName = await prismaClient.branch.count({
                where:{
                    name: updateRequest.name
                }
            })
    
            if(existName > 0) {
                throw new ResponseError(400, "Name already exists");
            }
        }

        const branch = {
            ...updateRequest, // Copy other fields from the original request
            updated_at : Helper.dateTimeLocal(new Date()),
            updated_by : user.username,
        };
        logger.info('==== param branch update ====')
        logger.info(branch)
        const result = await prismaClient.branch.update({ 
            where: {
                id: updateRequest.id
            },
            data: branch
        });

        return toBranchResponse(result)
    }

    static async getById(request: ByIdRequest): Promise<BranchResponse | null> {
        logger.info("===== Get branch by id =====")
        if(request.id) {
            const existdata = await prismaClient.branch.findFirst({
                where:{
                    id: request.id
                }
            })

            if(existdata == null) {
                throw new ResponseError(404, DATA_NOT_FOUND!);
            }

            return existdata
    
        } else {
            throw new ResponseError(404, DATA_NOT_FOUND!);
        }
    }

    static async delete(request: ByIdRequest): Promise<BranchResponse | null> {
        logger.info("===== Delete branch by id =====")
        logger.info(request.id)
        if(request.id) {

            const checkThisBranchUsed = await prismaClient.warehouse.findFirst({
                where:{
                    branch_id: request.id
                }
            })
            
            if(checkThisBranchUsed) {
                throw new ResponseError(400, "This branch used on " + checkThisBranchUsed.name);
            }

            const existdata = await prismaClient.branch.count({
                where:{
                    id: request.id
                }
            })

            if(existdata == 0) {
                throw new ResponseError(404, DATA_NOT_FOUND!);
            }

            const result = await prismaClient.branch.delete({
                where:{
                    id: request.id
                }
            })

            return result
    
        } else {
            throw new ResponseError(404, DATA_NOT_FOUND!);
        }
    }
}