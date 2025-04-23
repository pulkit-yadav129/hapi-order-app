import { ProductRepository } from "../repository/product.repository";
import { Product } from "../types/products";
import { AppError } from "../utils/error";

export const ProductService={
    async createProduct(product:Product):Promise<number>{
        if(!product.name||!product.price||!product.quantity){
            throw new AppError('Missing required fields',400);
        }

        const productId=await ProductRepository.createProduct(product);
        return productId;
    },

    async getAllProducts():Promise<Product[]>{
        return await ProductRepository.getAllProducts();
    },

    async getProductById(id:number):Promise<Product>{
        const product=await ProductRepository.getProductById(id);
        if(!product){
            throw new AppError('Product Not Found!',400);
        }
        return product;
    },

    async updateProduct(id:number,product:Partial<Product>):Promise<void>{
        const existing=await ProductRepository.getProductById(id);

        if(!existing){
            throw new AppError('Product Not Found!',400);
        }

        await ProductRepository.updateProduct(id,{
            ...existing,
            ...product
        });
    },

    async deleteProduct(id:number):Promise<void>{
        const product=await ProductRepository.getProductById(id);

        if(!product){
            throw new AppError('Product not found!',400);
        }

        await ProductRepository.deleteProduct(id);
    }
};