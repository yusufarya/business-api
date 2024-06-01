import env from "dotenv";
import { Product, User } from "@prisma/client";
import { CreateProductRequest, ByIdRequest, ProductResponse, UpdateProductRequest, toProductResponse, UploadImageRequest } from "../../model/master/product-model";
import { prismaClient } from "../../app/database";
import { Validation } from "../../validation/master/validation";
import { ProductValidation } from "../../validation/master/product-validation";
import { logger } from "../../app/logging";
import { ResponseError } from "../../error/response-error";
import { Helper } from "../../utils/helper";
import path from "path";
import { unlink } from "fs";

env.config();

const DATA_NOT_FOUND = process.env.DATA_NOT_FOUND;

export class ProductService {
    static async getAllData(): Promise<Product[]> {
        const result = await prismaClient.product.findMany({
            include: {
                category: {
                    select: {
                        name : true
                    }
                },
                unit: {
                    select: {
                        initial: true,
                        name : true
                    }
                },
                brand:{
                    select: {
                        name : true
                    }
                }
            }
        })

        return result
    }

    static async store(request: CreateProductRequest, user: User): Promise<ProductResponse> {
        
        const productRequest = Validation.validate(ProductValidation.STORE, request)

        logger.info("===== Store product data =====")
        
        // const existName = await prismaClient.product.count({
        //     where:{
        //         name: productRequest.name
        //     }
        // })

        // if(existName > 0) {
        //     throw new ResponseError(400, "Product name already exists");
        // }
        
        const paramsProduct = {
            ...productRequest, // Copy other fields from the original request
            created_at : Helper.dateTimeLocal(new Date()),
            created_by : user.username,
        };
        
        const result = await prismaClient.product.create({ 
            data: paramsProduct
        });

        return toProductResponse(result)
    }

    static async update(request: UpdateProductRequest, user: User): Promise<ProductResponse> {
        
        const updateRequest = Validation.validate(ProductValidation.UPDATE, request)
        
        logger.info("===== Update product data =====")
        logger.info(updateRequest)
        if(updateRequest.id) {
            const existdata = await prismaClient.product.count({
                where:{
                    id: updateRequest.id
                }
            })
    
            if(existdata == 0) {
                throw new ResponseError(404, DATA_NOT_FOUND!);
            }
        } else {
            throw new ResponseError(404, DATA_NOT_FOUND!);
        }
        
        // if(updateRequest.name) {
        //     const existName = await prismaClient.product.count({
        //         where:{
        //             name: updateRequest.name
        //         }
        //     })
    
        //     if(existName > 0) {
        //         throw new ResponseError(400, "Name already exists");
        //     }
        // }

        const product = {
            ...updateRequest, // Copy other fields from the original request
            updated_at : Helper.dateTimeLocal(new Date()),
            updated_by : user.username,
        };
        logger.info('==== param product update ====')
        logger.info(product)
        const result = await prismaClient.product.update({ 
            where: {
                id: updateRequest.id
            },
            data: product
        });

        return toProductResponse(result)
    }

    static async upload(req: UploadImageRequest): Promise<String> {
        logger.info("===== Upload image product =====")
        const oldImg = req.body.old_image;
        if (!req.file) {
            throw new ResponseError(400, "No file uploaded")
        }

        const dir = process.env.NODE_ENV === 'production'
            ? path.join(__dirname, "../../dist/public/images/product")
            : path.join(__dirname, "../../src/public/images/product");
        const newImagePath = path.join("/src/public/images/product", req.file.filename);

        if (oldImg) {
            const oldImagePath = path.join(dir, oldImg);
            logger.info("====== UNLINK IMAGE OLD IF EXISTS ======")
            logger.info(oldImagePath)
            unlink(oldImagePath, (err) => {
                if (err) {
                logger.error(`Failed to delete old image: ${err.message}`);
                }
            });
        }

        return newImagePath;
    }

    static async getById(request: ByIdRequest): Promise<ProductResponse | null> {
        logger.info("===== Get product by id =====")
        if(request.id) {
            const existdata = await prismaClient.product.findFirst({
                where:{
                    id: request.id
                },
                include: {
                    category: {
                        select: {
                            name : true
                        }
                    },
                    unit: {
                        select: {
                            initial: true,
                            name : true
                        }
                    },
                    brand:{
                        select: {
                            name : true
                        }
                    }
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

    static async delete(request: ByIdRequest): Promise<ProductResponse | null> {
        logger.info("===== Delete product by id =====")
        logger.info(request.id)
        if(request.id) {

            const existdata = await prismaClient.product.count({
                where:{
                    id: request.id
                }
            })

            if(existdata == 0) {
                throw new ResponseError(404, DATA_NOT_FOUND!);
            }

            const result = await prismaClient.product.delete({
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