import { db } from './firebase';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import type { User, FoodPost, UserRole } from "./types";
import { add } from "date-fns";

export let users: User[] = [
    {
    id: "admin-1",
    name: "Admin User",
    email: "admin@foodconnect.com",
    password: "password123",
    role: "admin",
    status: "approved",
    city: "New York",
    },
    {
    id: "restaurant-1",
    name: "The Good Eatery",
    email: "restaurant@foodconnect.com",
    password: "password123",
    role: "restaurant",
    status: "approved",
    city: "New York",
    },
    {
    id: "restaurant-2",
    name: "Savory Bites",
    email: "restaurant2@foodconnect.com",
    password: "password123",
    role: "restaurant",
    status: "pending",
    city: "Los Angeles",
    },
    {
    id: "ngo-1",
    name: "Community Food Bank",
    email: "ngo@foodconnect.com",
    password: "password123",
    role: "ngo",
    status: "approved",
    city: "New York",
    },
    {
    id: "ngo-2",
    name: "Helping Hands",
    email: "ngo2@foodconnect.com",
    password: "password123",
    role: "ngo",
    status: "rejected",
    city: "New York",
    },
    {
    id: "ngo-3",
    name: "LA Food Share",
    email: "ngo3@foodconnect.com",
    password: "password123",
    role: "ngo",
    status: "approved",
    city: "Los Angeles",
    }
];

export let foodPosts: FoodPost[] = [
    {
    id: "post-1",
    restaurantId: "restaurant-1",
    itemName: "Surplus Bread Loaves",
    quantity: "20 loaves",
    expiryTime: add(new Date(), { hours: 24 }),
    pickupTime: "Today, 4 PM - 6 PM",
    status: "Available",
    city: "New York",
    claimedByNgoId: null,
    },
    {
    id: "post-2",
    restaurantId: "restaurant-1",
    itemName: "Vegetable Soup",
    quantity: "15 liters",
    expiryTime: add(new Date(), { hours: 12 }),
    pickupTime: "Today, 8 PM - 9 PM",
    status: "Claimed",
    city: "New York",
    claimedByNgoId: "ngo-1",
    },
    {
    id: "post-3",
    restaurantId: "restaurant-1",
    itemName: "Assorted Pastries",
    quantity: "3 boxes",
    expiryTime: add(new Date(), { days: -1 }),
    pickupTime: "Yesterday, 5 PM - 7 PM",
    status: "Picked up",
    city: "New York",
    claimedByNgoId: "ngo-1",
    },
];

// Helper functions to modify mock data

export const updateUserStatus = (userId: string, status: "approved" | "rejected") => {
    users = users.map((user) => (user.id === userId ? { ...user, status } : user));
    return users.find(u => u.id === userId);
};

export const addFoodPost = (post: Omit<FoodPost, 'id'>) => {
    const newPost: FoodPost = {
        ...post,
        id: `post-${Date.now()}`
    };
    foodPosts.push(newPost);
    return newPost;
}

export const claimFoodPost = (postId: string, ngoId: string) => {
    foodPosts = foodPosts.map(post => post.id === postId ? {...post, status: 'Claimed', claimedByNgoId: ngoId} : post);
    return foodPosts.find(p => p.id === postId);
}

export const markAsPickedUp = (postId: string) => {
    foodPosts = foodPosts.map(post => post.id === postId ? {...post, status: 'Picked up'} : post);
    return foodPosts.find(p => p.id === postId);
}

// ✅ Adds new users as "pending"
export const addUser = (
  name: string,
  email: string,
  password: string,
  role: UserRole,
  city: string
): User => {
  const newUser: User = {
    id: `${role}-${Date.now()}`,
    name,
    email,
    password,
    role,
    city,
    status: "pending", // ← required for admin approval
  };
  users.push(newUser);
  return newUser;
};

export async function addFoodPost(post: Omit<FoodPost, 'id'>): Promise<FoodPost> {
  const docRef = await addDoc(collection(db, 'foodPosts'), {
    ...post,
    expiryTime: Timestamp.fromDate(post.expiryTime),
  });

  return {
    id: docRef.id,
    ...post,
  };
}