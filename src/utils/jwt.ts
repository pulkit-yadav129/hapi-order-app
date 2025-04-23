import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET=process.env.JWT_SECRET as string;

/*export function generateToken(id:number,username:string,role:string):string{
    const payload={id,username,role};
    return jwt.sign(payload,JWT_SECRET ,{expiresIn:'1d'});
}*/


export const signToken=(payload:object):string=>{
    return jwt.sign(payload,JWT_SECRET,{expiresIn:'1d'});
};

export const verifyToken=(token:string):any=>{
    try{
        return jwt.verify(token,JWT_SECRET);
    }
    catch (error){
        throw new Error('Invalid Token');
    }
};




//export default validateJWT;