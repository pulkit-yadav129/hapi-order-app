import Hapi from '@hapi/hapi';
import jwt from '@hapi/jwt';
import  authRoutes  from './routes/authRoutes';
import orderRoutes from './routes/orderRoutes';
import validateJWT from './utils/jwt';
import dotenv from 'dotenv';
//import { verify } from 'crypto';

dotenv.config();

const init=async()=>{
    const server=Hapi.server({
        port:3000,
        host:'localhost',
    });

    await server.register(jwt);

    server.auth.strategy('jwt','jwt',{
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
    });

    server.auth.default('jwt');

    server.route([...authRoutes, ...orderRoutes])

    //authRoutes(server);
    //orderRoutes(server);

    await server.start();

    console.log(`Server running at: ${server.info.uri}`);
};
init();