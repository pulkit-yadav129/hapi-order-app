import { Order,OrderItem } from "../types/order";
import * as orderRepo from '../repository/order.repository';



export const createOrderForUser=async (
    userId:number,
    paymentMode:string,
    isCod:boolean,
    items:OrderItem[]
):Promise<number>=>{
    if(items.length==0){
        throw new Error('Order must contain atleast one item');
    }

    const totalOrders= await orderRepo.getUserOrderCount(userId);
    if(totalOrders>=10){
        throw new Error('Order Limit Reached. A user can place maximum 10 orders.');
    }

    const order:Order={
        userId,
        paymentMode,
        isCod,
    };

    const orderId=await orderRepo.createOrder(order,items);

    return orderId;
}