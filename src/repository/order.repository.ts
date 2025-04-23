import db from '../config/db';
import { Order,OrderItem } from '../types/order';

export const createOrder=async(order:Order,items:OrderItem[]):Promise<number>=>{
    const conn=await db.getConnection();
    try{
        await conn.beginTransaction();

        const [orderResult]:any = await conn.query(
            'INSERT INTO orders (user_id,payment_mode,is_cod) VALUES (?,?,?)',
            [order.userId,order.paymentMode,order.isCod]
        );

        const orderId=orderResult.insertId;

        for (const item of items){
            await conn.query(
                'INSERT INTO order_items(order_id,product_name,quantity,price) VALUES(?,?,?,?)',
                [orderId,item.productName,item.quantity,item.price]
            );
        }
        
        await conn.commit();
        return orderId;
    }catch(err){
        await conn.rollback();
        throw err;
    }finally{
        conn.release();
    }
};

export const getUserOrderCount=async(userId:number):Promise<number>=>{
    const [rows]:any= await db.query(
        'SELECT COUNT(*) as count FROM orders WHERE user_id=?',
        [userId]
    );
    return rows[0].count;
};