import { prismaClient } from "../app/database";
import { logger } from "../app/logging";
import { ResponseError } from "../error/response-error";
import { ConversionUnitResponse } from "../model/master/conversion-unit-model";

export class MasterHelper {
    static async updateConversionUnit(result: ConversionUnitResponse, dataConversion: ConversionUnitResponse) {
        if(result) {
            logger.info(" ================ ============================ ================ ")
            logger.info(" ================ dataConversion convetsion units ================ ")
            logger.info(dataConversion)
            
            try {

                const conversionUnits = await prismaClient.conversionUnit.findMany({
                    where: {
                        product_id: dataConversion.product_id
                    }
                })
    
                logger.info(" ====== List Conversion Units ====== ")
                logger.info(conversionUnits)
    
                conversionUnits.map(async(item) => {

                    const conversionQty = dataConversion.qty / item.qty 

                    const updateConversionUnits = await prismaClient.conversionUnit.update({
                        where: {
                            id: item.id
                        },
                        data: {
                            conversion_qty: conversionQty
                        }
                    })
                })


            } catch (error) {
                logger.error("error update data conversion units")
                logger.error(error)
                throw new ResponseError(400, 'Failed to updating data conversion units')
            }

            return dataConversion
        } else {
            throw new ResponseError(400, 'An error occurred while inserting data Convertion unit')
        }
    }
}