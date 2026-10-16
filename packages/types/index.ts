

export const UserRole = {
    CUSTOMER: "CUSTOMER",
    RESTURANT_OWNER: "RESTAURANT",
    DRIVER: "DRIVER"
} as const

export type UserRole = typeof UserRole[keyof typeof UserRole]


export interface User {
    id:string;
    firstName:string;
    lastName:string;
    email:string;
    role:UserRole;
    createdAt:string;
    updatedAt:string;
}

export interface HealthCheck {
    status: string;
    timestamp: string;
}

export interface JwtPayload {
    sub: string;
    email: string;
    role: UserRole;
}

export interface RestaurantType{
    id: string;
    ownerId: string;
    name: string;
    description: string;
    imageUrl:string;
    rating:string;
    reviewCount:number;
    isOpen:boolean;
    createdAt:number;
    updatedAt:number;
}