export interface User{
    id:number;
    username:string;
    password:string;
    role:'admin'|'user';
}

export interface JwtPayload{
    id:number;
    role:'admin'|'user';
    iat?:number;
    exp?:number;
}