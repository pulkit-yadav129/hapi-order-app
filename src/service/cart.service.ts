import { getCartItemsByUserId, getCartTotalByUserId } from "../repository/cart.repository";
import { addItemsToCart as addToCartRepo } from "../repository/cart.repository";
import { ProductRepository } from "../repository/product.repository";
import { AppError } from "../utils/error";

export const addToCartHandler = async (
    userId: number,
    items:{productId: number,quantity: number}[]   
): Promise<void> => {
    //console.log('addToCartHandler called with:', userId, productId, quantity);
    

    await addToCartRepo(userId,items);
};

export const getCartTotal = async (userId: number): Promise<number> => {
    //console.log('getCartTotal called with:', userId);
    return await getCartTotalByUserId(userId);
};

export const getCartItems=async(userId:number)=>{
    const cartItems=await getCartItemsByUserId(userId);
    return cartItems;
};
