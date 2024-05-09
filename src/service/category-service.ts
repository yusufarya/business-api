import env from "dotenv";
import { Category, User } from "@prisma/client";
import { CreateCategoryRequest, ByIdRequest, CategoryResponse, UpdateCategoryRequest, toCategoryResponse } from "../model/category-model";
import { prismaClient } from "../app/database";
import { Validation } from "../validation/validation";
import { CategoryValidation } from "../validation/category-validation";
import { logger } from "../app/logging";
import { ResponseError } from "../error/response-error";
import { Helper } from "../utils/helper";

env.config();

const DATA_NOT_FOUND = process.env.DATA_NOT_FOUND;

export class CategoryService {
    static async getAllData(): Promise<Category[]> {
        const result = await prismaClient.category.findMany()

        return result
    }

    static async store(request: CreateCategoryRequest, user: User): Promise<CategoryResponse> {
        
        const categoryRequest = Validation.validate(CategoryValidation.STORE, request)

        logger.info("===== Store category data =====")
        
        const existName = await prismaClient.category.count({
            where:{
                name: categoryRequest.name
            }
        })

        if(existName > 0) {
            throw new ResponseError(400, "Category name already exists");
        }
        
        categoryRequest.created_at = Helper.dateTimeLocal(new Date());
        categoryRequest.created_by = user.username;
        logger.info(categoryRequest)
        const result = await prismaClient.category.create({ 
            data: categoryRequest 
        });

        return toCategoryResponse(result)
    }

    static async update(request: UpdateCategoryRequest, user: User): Promise<CategoryResponse> {
        
        const updateRequest = Validation.validate(CategoryValidation.UPDATE, request)
        
        logger.info("===== Update category data =====")
        if(updateRequest.id) {
            const existdata = await prismaClient.category.count({
                where:{
                    id: updateRequest.id
                }
            })
    
            if(existdata == 0) {
                throw new ResponseError(404, DATA_NOT_FOUND!);
            }
        }
        
        if(updateRequest.name) {
            const existName = await prismaClient.category.count({
                where:{
                    name: updateRequest.name
                }
            })
    
            if(existName > 0) {
                throw new ResponseError(400, "Name already exists");
            }
        }

        const category = {
            ...updateRequest, // Copy other fields from the original request
            updated_at : Helper.dateTimeLocal(new Date()),
            updated_by : user.username,
        };
        logger.info('==== param category update ====')
        logger.info(category)
        const result = await prismaClient.category.update({ 
            where: {
                id: updateRequest.id
            },
            data: category
        });

        return toCategoryResponse(result)
    }

    static async getById(request: ByIdRequest): Promise<CategoryResponse | null> {
        logger.info("===== Get category by id =====")
        if(request.id) {
            const existdata = await prismaClient.category.findFirst({
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

    static async delete(request: ByIdRequest): Promise<CategoryResponse | null> {
        logger.info("===== Delete category by id =====")
        if(request.id) {
            const existdata = await prismaClient.category.count({
                where:{
                    id: request.id
                }
            })

            if(existdata == 0) {
                throw new ResponseError(404, DATA_NOT_FOUND!);
            }
            
            const checkThisCategoryUsed = await prismaClient.product.findFirst({
                where:{
                    category_id: request.id
                }
            })
            
            if(checkThisCategoryUsed) {
                throw new ResponseError(400, "This category used on product '" + checkThisCategoryUsed.name + "'");
            }

            const result = await prismaClient.category.delete({
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