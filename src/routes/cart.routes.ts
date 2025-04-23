import { ServerRoute } from "@hapi/hapi";
import { addToCartHandler, getCartItems, getCartTotal } from "../service/cart.service";
import { verifyToken } from "../utils/jwt";
import { handleError } from "../utils/error";
import { addToCartSchema } from "../validation/cartValidation";

export const cartRoutes: ServerRoute[] = [
    {
        method: 'GET',
        path: '/cart/total',
        options: {
            auth: 'jwt',
            description: 'Get total value of items in a cart',
        },
        handler: async (request, h) => {
            try {
                //console.log('GET /cart/total called');
                const userId = (request.auth.credentials as { id: number }).id;
                const total = await getCartTotal(userId);
                return h.response({ total }).code(200);
            } catch (err) {
                //console.error('Error in GET /cart/total:', err);
                return handleError(err, h);
            }
        },
    },
    {
        method: 'POST',
        path: '/cart/add',
        handler: async (request, h) => {
            try {
                //console.log('POST /cart/add called');
                //console.log('Auth credentials:', request.auth.credentials);
                const userId = (request.auth.credentials as { id: number }).id;
                const {items} = request.payload as any;
                await addToCartHandler(userId,items);
                return h.response({success:true,message:'Items added to cart!'}).code(201);
            } catch (err) {
                //console.error('Error in POST /cart/add:', err);
                return handleError(err, h);
            }
        },
        options: {
            auth: 'jwt',
            validate: {
                payload: addToCartSchema,
                failAction: (request, h, err) => {
                    console.error('Validation error:', err);
                    throw err;
                }
            }
        },
    },

    {
        method:'GET',
        path:'/cart',
        options:{
            auth:'jwt',
            description:'Get the cart items for the user'
        },
        handler:async(request,h)=>{
            try{
                const userId=(request.auth.credentials as { id: number }).id;
                const cartItems=await getCartItems(userId);
                return h.response({success:true,data:cartItems}).code(200);
            }
            catch(err){
                console.error('Get cart items error!',err);
                return h.response({error:'Failed to fetch cart items'}).code(500);
            }
        }
    }
];
