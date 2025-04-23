import Boom from '@hapi/boom';
import { ResponseToolkit } from '@hapi/hapi';


export class AppError extends Error{
    public statusCode:number;

    constructor(message:string,statusCode:number=400){
        super(message);
        this.statusCode=statusCode;
        Error.captureStackTrace(this,this.constructor);
    }
}

export const handleError=(err:unknown,h:ResponseToolkit)=>{
    if(err instanceof Error){
        return h.response({error:err.message}).code(400);
    }

    return h.response({error:'An unknown error occured!'}).code(400);
};

