export type UserRole = "admin" | "restaurant" | "ngo";
export type UserStatus = "pending" | "approved" | "rejected";
export type FoodPostStatus = "Available" | "Claimed" | "Picked up";

export interface User {
    id: string;
    name: string;
    email: string;
    password?: string;
    role: UserRole;
    status: UserStatus;
    city: string;
}

export interface FoodPost {
    id:string;
    restaurantId: string;
    itemName: string;
    quantity: string;
    expiryTime: Date;
    pickupTime: string;
    status: FoodPostStatus;
    claimedByNgoId?: string | null;
    city: string;
}
