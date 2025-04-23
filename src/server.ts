import Hapi from '@hapi/hapi';
import jwt from '@hapi/jwt';
import pool from './config/db';
import  authRoutes  from './routes/auth.routes';
import orderRoutes from './routes/order.routes';
//import validateJWT from './utils/jwt';
import { registerAuthStrategy } from './middleware/auth.strategy';
import dotenv from 'dotenv';
import { productRoutes } from './routes/product.routes';
import { cartRoutes } from './routes/cart.routes';
//import { verify } from 'crypto';

dotenv.config();

const init=async()=>{
    const server=Hapi.server({
        port:3000,
        host:'localhost',
    });

    const conn=await pool.getConnection();
    console.log('DB Connection made successfully!');
    conn.release();
    
    await registerAuthStrategy(server);
    //await server.register(jwt);

    /*server.auth.strategy('jwt','jwt',{
        keys:process.env.JWT_SECRET,
        validate:validateJWT,
        verify:{
            aud:false,
            iss:false,
            sub:false,
            nbf:true,
            exp:true,
            maxAgeSec:14400,
            timeSkewSec:15
        },
    });*/

    //server.auth.default('jwt');

    server.route([...authRoutes, ...orderRoutes,...productRoutes,...cartRoutes])

    //authRoutes(server);
    //orderRoutes(server);

    await server.start();

    console.log(`Server running at: ${server.info.uri}`);
};
init();