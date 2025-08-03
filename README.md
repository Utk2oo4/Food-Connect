# 🍽️ Food Connect

A web application built with Next.js and Firebase that connects restaurants with NGOs to donate surplus food and combat world hunger. It features real-time interactions where admins approve users, restaurants post available food, and NGOs can claim and pick up donations efficiently.

### 🧑‍⚖️ **Admins**
- Approve or reject new restaurant and NGO accounts
- View user statistics and food activity across cities
  
### 🍴 **Restaurants**
- Sign up or log in
- Post surplus food with details like quantity, expiry, and pickup time

### ❤️ **NGOs**
- Sign up or log in
- View available food items from nearby restaurants
- Claim and track food pickups

---

👉 **Live URL:** [https://food-connect-75w5.vercel.app/login](https://food-connect-75w5.vercel.app/login)

---

## 🚀 Features

- 🔐 Authentication (Firebase Auth)
- 👤 Role-based access (Admin, Restaurant, NGO)
- ✅ Admin approval system
- 🍱 Food posting and claiming
- 🔄 Real-time Firestore updates
- 📊 Admin dashboard with analytics
- 📍 City-based filtering

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, TailwindCSS
- **Backend**: Firebase Firestore, Firebase Auth
- **Hosting**: Vercel
- **Charting**: Recharts

---

## 🚀 Try It Now

➡️ Open [https://food-connect-75w5.vercel.app/login](https://food-connect-75w5.vercel.app/login)

- Click on signup and fill the details and choose your role ie., NGO/Charity or Restaurants
  <img width="1437" height="809" alt="Screenshot 2025-08-03 at 4 15 55 PM" src="https://github.com/user-attachments/assets/347b8a30-bebd-463b-b63e-952035cc75df" />
  
- You will be redirected to login form and login the email and password but you will have to wait until approved by the admin
  <img width="1440" height="814" alt="Screenshot 2025-08-03 at 4 17 08 PM" src="https://github.com/user-attachments/assets/ae3a87bc-ac62-4164-9ec7-2d74e99b8d6e" />
  
## Admin Login

- Go to login page and enter these credentials: email- admin@foodconnect.com  password-password123 , then you will enter admin dashboard
  <img width="1430" height="797" alt="Screenshot 2025-08-03 at 4 22 29 PM" src="https://github.com/user-attachments/assets/0ae00574-a3c3-4469-9477-7a64dca44913" />
  
- Here admin can approve or reject the NGO or Restaurants
  
- Admin can see all the data of Restaurants, NGO's, Food Items posted or claimed, etc

- After getting approved my admin the user can login
  <img width="1439" height="811" alt="Screenshot 2025-08-03 at 4 25 11 PM" src="https://github.com/user-attachments/assets/b2168651-0943-4253-8065-929dd41879dc" />
 
- Here the restaurant can post about surplus food
  <img width="1440" height="813" alt="Screenshot 2025-08-03 at 4 27 40 PM" src="https://github.com/user-attachments/assets/9aebb63e-d8e1-4e07-ab73-233122d1483e" />

- And the NGO which are from the same city can see posted food and claim it from the restaurant
  <img width="1440" height="816" alt="Screenshot 2025-08-03 at 4 31 12 PM" src="https://github.com/user-attachments/assets/9af887f4-8c22-423b-880b-1577dee488ff" />
