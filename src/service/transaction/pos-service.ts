import env from "dotenv";
import { POSCart } from "@prisma/client";

import { prismaClient } from "../../app/database";
import { logger } from "../../app/logging";
import { ResponseError } from "../../error/response-error";
import { ByIdRequestCart, POSCartRequest, POSCartResponse, toPOSCartResponse } from "../../model/transaction/pos-model";

env.config();

const DATA_NOT_FOUND = process.env.DATA_NOT_FOUND;

export class PosService {
    
    static async getAllData(request: POSCartRequest): Promise<POSCart[]> {
        const result = await prismaClient.pOSCart.findMany({
            where: {
                username : request.username
            },
            include: {
                product: {
                    select: {
                        name: true,
                        selling_price: true
                    }
                },
                branch: {
                    select: {
                        name: true
                    }
                },
                warehouse: {
                    select: {
                        name: true
                    }
                }
            }
        })

        if(!result) {
            throw new ResponseError(404, DATA_NOT_FOUND!)
        }

        return result
    }

    static async update(request: POSCartRequest): Promise<POSCartResponse> {
        logger.info("===== Update cart POS data =====");
        logger.info(request);

        let result;
        if (!request.id) {
            const existDataNotId = await prismaClient.pOSCart.findFirst({
                where: {
                    product_id: request.product_id,
                    branch_id: request.branch_id,
                    warehouse_id: request.warehouse_id,
                    username: request.username,
                }
            });
            logger.info('existDataNotId :')
            logger.info(existDataNotId)
            if(existDataNotId) {
                result = await prismaClient.pOSCart.update({ 
                    where: {
                        id: existDataNotId.id,
                        product_id: existDataNotId.product_id,
                        branch_id: existDataNotId.branch_id,
                        warehouse_id: existDataNotId.warehouse_id,
                        username: request.username,
                    },
                    data: request
                });
            } else {
                result = await prismaClient.pOSCart.create({ 
                    data: request
                });
            }
        
            if (!result) {
                throw new ResponseError(400, 'Error inserting cart');
            }

        } else {

            const existData = await prismaClient.pOSCart.findFirst({
                where: {
                    id: request.id,
                    product_id: request.product_id,
                    branch_id: request.branch_id,
                    warehouse_id: request.warehouse_id,
                }
            });
            if(existData) {
                result = await prismaClient.pOSCart.update({ 
                    where: {
                        id: request.id,
                        product_id: existData.product_id,
                        branch_id: existData.branch_id,
                        warehouse_id: existData.warehouse_id,
                    },
                    data: request
                });
                if (!result) {
                    throw new ResponseError(400, 'Error updating cart');
                }
            } else {
                throw new ResponseError(404, DATA_NOT_FOUND!);
            }
        }
    
        return toPOSCartResponse(result);
    }

    static async getById(request: ByIdRequestCart): Promise<POSCartResponse | null> {
        logger.info("===== Get Cart POS by id =====")
        logger.info(request.id)
        if(request.id) {
            const existdata = await prismaClient.pOSCart.findFirst({
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

    static async delete(request: POSCartRequest): Promise<POSCartResponse | null> {
        logger.info("===== Delete cart product by id =====");
        logger.info(request.id);
    
        if (!request.id) {
            const existdata = await prismaClient.pOSCart.findMany({
                where: {
                    username: request.username,
                },
            });

            logger.info('Get all cart by username : ')
            logger.info(existdata)
    
            if (existdata.length === 0) {
                throw new ResponseError(404, DATA_NOT_FOUND!);
            }
    
            const deletePromises = existdata.map(async (row) => {
                return prismaClient.pOSCart.delete({
                    where: {
                        id: row.id,
                    },
                });
            });
    
            const results = await Promise.all(deletePromises);
    
            return results.length > 0 ? toPOSCartResponse(results[0]) : null;
        } else if(request.id && request.username) {
            const result = await prismaClient.pOSCart.delete({
                where: {
                    id: request.id,
                    username: request.username
                },
            });
    
            return result ? toPOSCartResponse(result) : null;
        } else {
            throw new ResponseError(404, DATA_NOT_FOUND!)
        }
    }
    
}