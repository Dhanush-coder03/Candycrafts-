# 🌸 Candy Crafts — Node.js & MongoDB Backend

Backend server for Candy Crafts built with **Node.js**, **Express**, and **MongoDB (Mongoose)**, ready for **Vercel** serverless deployment.

---

## 🚀 Features

- **Products API**: Full CRUD, category filtering, search, and featured crafts (`/api/products`)
- **Categories API**: List and manage boutique collections (`/api/categories`)
- **Orders API**: Capture customer order queries, manage statuses (`/api/orders`)
- **Inquiries API**: Handle contact messages and bespoke craft requests (`/api/inquiries`)
- **Contact & Settings API**: Manage studio details and owner email (`/api/contact`)
- **Owner & Customer Email**: Automated dispatch from `candycraftssstudio@gmail.com` via Nodemailer
- **Vercel Ready**: Serverless handler (`api/index.js`) and `vercel.json` rewrites included
- **Database Seeder**: Pre-populates the complete handmade catalog with 1 command (`npm run seed`)

---

## 🛠️ Local Setup

1. **Install dependencies**:
   ```bash
   cd backend
   npm install
   ```

2. **Configure Environment Variables**:
   In `backend/.env`:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/candycrafts?retryWrites=true&w=majority
   OWNER_EMAIL=candycraftssstudio@gmail.com
   CLIENT_URL=http://localhost:5173
   ```

3. **Seed Database with Curated Catalog**:
   ```bash
   npm run seed
   ```

4. **Start the Server**:
   ```bash
   npm run dev    # with nodemon
   # or
   npm start      # standard node
   ```

---

## ☁️ Vercel Deployment Guide

### Option 1: Deploy Backend as a Vercel Project
1. Push your repository to **GitHub**.
2. Open **[vercel.com](https://vercel.com)** and click **"Add New Project"**.
3. Select your GitHub repository.
4. Set **Root Directory** to `backend`.
5. Under **Environment Variables**, add:
   - `MONGODB_URI`: Your MongoDB Atlas URI
   - `OWNER_EMAIL`: `candycraftssstudio@gmail.com`
   - `CLIENT_URL`: `https://your-frontend.vercel.app` (or `*`)
6. Click **Deploy**. Your backend will be live at `https://your-backend.vercel.app`.

### Option 2: Deploy Frontend on Vercel
1. Add a new project in Vercel.
2. Set **Root Directory** to `frontend`.
3. Add Environment Variable:
   - `VITE_API_URL`: `https://your-backend.vercel.app/api`
4. Click **Deploy**.
