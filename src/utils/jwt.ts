import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export function generateToken(id:number,username:string,role:string):string{
    const payload={id,username,role};
    return jwt.sign(payload,process.env.JWT_SECRET as string ,{expiresIn:'1h'});
}

export const validateJWT=async(artifacts:any,request:any,h:any)=>{
    return {
        isValid:true,
        credentials:{
            id:artifacts.decoded.payload.id,
            username:artifacts.decoded.payload.username,
            role:artifacts.decoded.payload.role,

        },
    };
};

export default validateJWT;