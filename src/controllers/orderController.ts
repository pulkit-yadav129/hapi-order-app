import {Request, ResponseToolkit} from '@hapi/hapi';
import {poolPromise} from '../db/db';

export const createOrder=async(request:Request,h:ResponseToolkit)=>{
    const {payment_mode,is_cod,items}=request.payload as any;
    const user=request.auth.credentials as {id:number,username:string,role:string};
    
    console.log("id: "+user.id);

    try{
        const pool=await poolPromise;

        const[rows]:any =await pool.query(`SELECT COUNT(*) as orderCount from orders where user_id=?`,[user.id]);

        if(rows[0].orderCount>=10)
        {
            return h.response({error:"Order limit reached!!"}).code(403);
        }
        const [orderResult]:any=await pool.query(`INSERT INTO orders (user_id,payment_mode,is_cod)
                                            VALUES(?,?,?)`,
                                        [user.id,payment_mode,is_cod]);

        
        const orderId=orderResult.insertId;

        for(const item of items){
            await pool.query(
                `Insert into order_items(order_id,product_name,quantity,price) VALUES (?,?,?,?)`,
                [orderId,item.product_name,item.quantity,item.price]
            );
        }
        return h.response({
            message:'Order Placed Successfully!!',
            orderId:orderResult.insertId,
        }).code(201);
    }
    catch(err){
        console.error(err);
        return h.response({error:'Failed to place order. Try again!'}).code(500);
    }
}; 
