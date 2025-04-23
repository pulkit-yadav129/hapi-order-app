import { RowDataPacket } from 'mysql2';
import db from '../config/db';

interface TotalRow extends RowDataPacket {
    total: number | null;
}

export const addItemsToCart = async (userId: number, items:{productId:number,quantity:number}[]) => {
    //console.log('addToCart called with:', userId, productId, quantity);
   

    const conn = await db.getConnection();
    try {
        //console.log('Database connection established');
        //await db.beginTransaction();
        for(const item of items){
            await db.query('INSERT INTO cart_items (user_id,product_id,quantity) VALUES (?,?,?) ON DUPLICATE KEY UPDATE quantity=quantity+VALUES(quantity)',
                [userId,item.productId,item.quantity]
            );
        }
        await conn.commit();
    }catch(error){
        conn.rollback();
        throw error;
    }
        
    finally {
        conn.release();
    }
};

export const getCartItemsByUserId=async(userId:number)=>{
    const [rows]=await db.query(
        'SELECT ci.id,ci.product_id,ci.quantity,p.name,p.price FROM cart_items ci JOIN products p ON ci.product_id=p.id WHERE ci.user_id=?',
        [userId]
    );

    return rows;
};

export const getCartTotalByUserId = async (userId: number): Promise<number> => {
    //console.log('getCartTotalByUserId called with:', userId);
    const conn = await db.getConnection();
    try {
        //console.log('Database connection established');
        const [rows] = await conn.query<TotalRow[]>(
            'SELECT SUM(ci.quantity*p.price) AS total FROM cart_items ci JOIN products p ON ci.product_id=p.id WHERE ci.user_id=?',
            [userId]
        );

        return rows[0]?.total ?? 0;
    } finally {
        conn.release();
    }
};
