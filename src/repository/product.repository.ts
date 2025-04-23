import { Product } from "../types/products";
import db from '../config/db';

export const ProductRepository={
    async createProduct(product:Product):Promise<number>{
        const conn=await db.getConnection();
        try{
            const [result]:any=await conn.query(
                'INSERT INTO products (name,description,price,quantity)VALUES(?,?,?,?)',
                [product.name,product.description,product.price,product.quantity]
            );
            return result.insertId;
        }finally{
            conn.release();
        }
    },

    async getAllProducts():Promise<Product[]>{
        const conn=await db.getConnection();
        try{
            const [rows]:any=await conn.query('SELECT * from products');
            return rows;
        }
        finally{
            conn.release();
        }
    },

    async getProductById(id:number):Promise<Product|null>{
        const conn=await db.getConnection();

        try{
            const [rows]:any=await conn.query(
                'SELECT * FROM products WHERE id=?',
                [id]
            );
            return rows[0]||null;
        }finally{
            conn.release();
        }
    },


    async updateProduct(id:number,product:Partial<Product>):Promise<void>{
        const conn=await db.getConnection();

        try{
            await conn.query('UPDATE products SET name=?,description=?,price=?,quantity=? WHERE id=?',
                [product.name,product.description,product.price,product.quantity,product.id]
            );
        }
        finally{
            conn.release();
        }
    },

    async deleteProduct(id:number):Promise<void>{
        const conn=await db.getConnection();

        try{
            await conn.query('DELETE FROM products WHERE id=?',[id]);
        }
        finally{
            conn.release();
        }
    }
};