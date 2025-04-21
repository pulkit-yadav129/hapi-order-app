import {ServerRoute} from '@hapi/hapi';

import { loginHandler,registerHandler } from "../controllers/authController";

const authRoutes: ServerRoute[]=[
    
        {
            method:'POST',
            path:'/register',
            handler:registerHandler,
            options:{auth:false},
        },
        {
            method:'POST',
            path:'/login',
            handler:loginHandler,
            options:{auth:false},
        },
    ];


export default authRoutes;