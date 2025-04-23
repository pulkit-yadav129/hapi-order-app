import {ServerRoute} from '@hapi/hapi';

import Joi from 'joi';
import * as authService from '../service/auth.service';

const authRoutes:ServerRoute[]=[
    {
        method:'POST',
        path:'/register',
        options:{
            auth:false,
            validate:{
                payload:Joi.object({
                    username:Joi.string().required(),
                    password:Joi.string().min(8).required(),
                    role:Joi.string().valid('admin','user').required(),
                }),
                failAction:(request,h,err)=>{
                    throw err;
                },
            },
        },
        handler:async(request,h)=>{
            const {username,password,role}=request.payload as any;

            try{
                await authService.registerUser(username,password,role);
                return h.response({message:'User registered successfully!!'}).code(201);
            }catch(err:any){
                return h.response({error:err.message}).code(400);
            }
        },
    },
    {
        method:'POST',
        path:'/login',
        options:{
            auth:false,
            validate:{
                payload:Joi.object({
                    username:Joi.string().required(),
                    password:Joi.string().required(),
                }),
                failAction:(request,h,err)=>{
                    throw err;
                },
            },
        },
        handler:async(request,h)=>{
            const { username,password }=request.payload as any;
            try {
                const token=await authService.loginUser(username,password);
                return h.response({token}).code(200);
            }catch(err:any){
                return h.response({error:err.message}).code(401);
            }
        },
    },
];

export default authRoutes;