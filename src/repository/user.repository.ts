import db from '../config/db';
import { User } from '../types/user';

export const findByUsername=async(username:string):Promise<User|null>=>{

    const [rows]:any=await db.query('SELECT * from users where username=?',[username]);
    return rows[0]||null;
};

export const createUser=async(user:Omit<User,'id'>):Promise<number>=>{
    const {username,password,role}=user;
    const [result]:any= await db.query(
        'INSERT INTO users (username,password,role) VALUES(?,?,?)',
        [username,password,role]
    );
    return result.insertId;
};


export const findUserById=async(id:number):Promise<User|null>=>{
    const [rows]:any= await db.query('SELECT * FROM users WHERE id=?',[id]);

    return rows[0]||null;
};