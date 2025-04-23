import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const config = {
    host: process.env.DB_SERVER,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections:true,
    connectionLimit:10,
    port: parseInt(process.env.DB_PORT || '3306'),
};

export const poolPromise = mysql.createPool(config);
    /*.getConnection()
    .then(connection => {
        console.log('Connected to MySQL Server');
        connection.release();
        return connection;
    })
    .catch(err => {
        console.error('Database Connection Failed:', err);
        throw err;
    });*/

export default poolPromise;
