import { ServerRoute } from "@hapi/hapi";
import Joi from 'joi';
import * as orderService from '../service/order.service';

const orderRoutes:ServerRoute[]=[
    {
        method:'POST',
        path:'/orders',
        options:{
            auth:'jwt',
            validate:{
                payload:Joi.object({
                    paymentMode:Joi.string().required(),
                    isCod:Joi.boolean().required(),
                    items:Joi.array()
                       .items(
                        Joi.object({
                            productName:Joi.string().required(),
                            quantity:Joi.number().min(1).required(),
                            price:Joi.number().min(0).required(),
                        })
                       )
                       .min(1).required(),
                }),
                failAction:(request,h,err)=>{
                    throw err;
                },
            },
        },
        handler:async(request,h)=>{
            const { paymentMode,isCod,items }=request.payload as any;
            const userId=(request.auth.credentials as any).id;

            try {
                const orderId=await orderService.createOrderForUser(userId,paymentMode,isCod,items);
                return h.response({message:'Order Placed Successfully!!',orderId}).code(201);
            }
            catch(err:any){
                return h.response({error:err.message}).code(400);
            }
        }
    },
];

export default orderRoutes;