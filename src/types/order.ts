export interface Order{
    id?:number;
    userId:number;
    paymentMode:string;
    isCod:boolean;
    createdAt?:Date;
}

export interface OrderItem{
    id?:number;
    orderId:number;
    productName:string;
    quantity:number;
    price:number;
}