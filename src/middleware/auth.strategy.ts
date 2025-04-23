import Hapi from '@hapi/hapi';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET=process.env.JWT_SECRET as string;


export const validateJWT=async(artifacts:any,request:Hapi.Request,h:Hapi.ResponseToolkit)=>{

    try{
        const decoded=jwt.verify(artifacts.token,JWT_SECRET) as any;
    
        return {
            isValid:true,
            credentials:{
                id:artifacts.decoded.payload.id,
                username:artifacts.decoded.payload.username,
                role:artifacts.decoded.payload.role,

            },
        };
    }
    catch(err){
        return {isValid:false,credentials:null};
    }
};

export const registerAuthStrategy=async(server: Hapi.Server)=>{
    await server.register(require('@hapi/jwt'));

    server.auth.strategy('jwt','jwt',{
            keys:JWT_SECRET,
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
};