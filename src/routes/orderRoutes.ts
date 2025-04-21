import { ServerRoute } from "@hapi/hapi";
import { createOrder } from "../controllers/orderController";

const orderRoutes:ServerRoute[]=[
    {
        method:'POST',
        path:'/orders',
        options:{
            auth:'jwt',
            handler:createOrder,
        },
    },
];

export default orderRoutes;