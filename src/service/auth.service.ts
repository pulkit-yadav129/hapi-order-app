import pool from '../config/db';
import bcrypt from 'bcrypt';
import jwt  from 'jsonwebtoken';
import { signToken } from '../utils/jwt';
import { hashPassword,comparePassword } from '../utils/hash';


export const registerUser=async(username:string,password:string,role:string)=>{
    const hashedPassword=await hashPassword(password);

    const conn=await pool.getConnection();
    try{
        await conn.query(
            'INSERT INTO users (username,password,role) VALUES (?,?,?)',
            [username,hashedPassword,role]
        );
    }catch (err:any){
        if(err.code==='ER_DUP_ENTRY'){
            throw new Error('Username already exists');
        }
        throw err;
    }finally{
        conn.release();
    }
};

export const loginUser=async(username:string,password:string)=>{
    const conn=await pool.getConnection();
    try{
        const [rows]: any= await conn.query(
            'SELECT * FROM users where username=?',
            [username]
        );

        if(!rows.length){
            throw new Error('Invalid Username or Password!!');
        }
        const user=rows[0];

        const passwordMatch=await comparePassword(password,user.password);
        if(!passwordMatch){
            throw new Error('Invalid Username or Password!!');
        }

        const token=signToken({id:user.id,role:user.role});
        return token;
    }finally{
        conn.release();
    }
}