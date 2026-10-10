

export enum UserRole {
    CUSTOMER = "CUSTOMER",
    RESTURANT_OWNER = "RESTAURANT_OWNER",
    DRIVER = "DRIVER"
}


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