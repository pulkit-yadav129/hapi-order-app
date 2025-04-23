import { ServerRoute } from "@hapi/hapi";
import { ProductService } from "../service/product.service";
import { verifyToken } from "../utils/jwt";
import { handleError } from "../utils/error";


export const productRoutes:ServerRoute[]=[
    {
        method:'POST',
        path:'/products',
        options:{
            auth:'jwt',
            handler:async(request,h)=>{
                try{
                    const product=request.payload as any;
                    const productId=await ProductService.createProduct(product);
                    return h.response({message:'Product created',productId}).code(201);
                }
                catch(err){
                    return handleError(err,h);
                }
            }
        }
    },

    {
        method:'GET',
        path:'/products',
        options:{
            auth:false,
            handler:async(_,h)=>{
                try{
                    const products=await ProductService.getAllProducts();
                    return h.response(products).code(200);
                }catch(err){
                    return handleError(err,h);
                }
            }
        }
    },

    {
        method:'GET',
        path:'/products/{id}',
        options:{
            auth:false,
            handler:async(request,h)=>{
                try{
                    const id=parseInt(request.params.id);
                    const product=await ProductService.getProductById(id);
                    return h.response(product).code(200);
                }catch(err){
                    return handleError(err,h);
                }
            }
        }
    },

    {
        method:'PUT',
        path:'/products/{id}',
        options:{
            auth:'jwt',
            handler:async (request,h)=>{
                try{
                    const id=parseInt(request.params.id);
                    const product=request.payload as any;
                    await ProductService.updateProduct(id,product);
                    return h.response({message:'Product Updated!'}).code(200);
                }
                catch(err){
                    return handleError(err,h);
                }
            }
        }
    },

    {
        method:'DELETE',
        path:'/products/{id}',
        options:{
            auth:'jwt',
            handler:async (request,h)=>{
                try{
                    const id=parseInt(request.params.id);
                    
                    await ProductService.deleteProduct(id);
                    return h.response({message:'Product Deleted!'}).code(200);
                }
                catch(err){
                    return handleError(err,h);
                }
            }
        }
    }
];