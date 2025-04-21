import { Request, ResponseToolkit } from "@hapi/hapi";
import { poolPromise } from "../db/db";
import bcrypt from 'bcrypt';
import { generateToken } from "../utils/jwt";
import { RowDataPacket, FieldPacket } from 'mysql2';

interface User extends RowDataPacket {
    username: string;
    password: string;
    role: 'admin' | 'user';
}

export const loginHandler = async (request: Request, h: ResponseToolkit) => {
    const { id, username, password } = request.payload as { id:number,username: string, password: string };

    try {
        const pool = await poolPromise;
        const [rows]: [User[], FieldPacket[]] = await pool.execute('SELECT * FROM users WHERE username = ?', [username]);

        const user = rows[0];

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return h.response({ message: 'Invalid Credentials!' }).code(401);
        }

        console.log("user: "+user);

        const token = generateToken(user.id,user.username, user.role);
        return h.response({ token }).code(200);

    } catch (err) {
        console.log(err);
        return h.response({ message: 'Internal Server Error' }).code(500);
    }
};

export const registerHandler = async (request: Request, h: ResponseToolkit) => {
    const { username, password, role } = request.payload as {
        username: string;
        password: string;
        role: 'admin' | 'user';
    };

    try {
        const pool = await poolPromise;

        const [existing]: [User[], FieldPacket[]] = await pool.execute('SELECT * FROM users WHERE username = ?', [username]);

        if (existing.length > 0) {
            return h.response({ message: 'Username already exists, enter a new one' }).code(409);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.execute('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [username, hashedPassword, role]);

        return h.response({ message: 'User Registered Successfully!' }).code(201);
    } catch (err) {
        console.log(err);
        return h.response({ message: 'Internal Server Error' }).code(500);
    }
};
