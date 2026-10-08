# Candy Crafts — Luxury Handmade Crafts & Floral Boutique

A frontend e-commerce web application for an artisanal boutique specializing in handmade floral bouquets, paper flowers, decorative arrangements, and clay idols.

Built with **React.js, Vite, Tailwind CSS, Lucide React, and React Router DOM**.

---

## 🌸 Key Highlights

### 1. Boutique Visual Aesthetics
- **Theme**: Luxury handmade boutique feeling with soft cream / ivory / beige backgrounds (`#FAF7F2`, `#F5EFEB`), elegant terracotta (`#C25D3B`), and warm walnut brown tones.
- **Typography**: Google Fonts (*Playfair Display* serif headings with *Plus Jakarta Sans* body text).
- **Interactive Micro-animations**: Smooth hover zooms, elevation states, quick action buttons, floating badges, and sliding drawers.

### 2. Public Storefront
- **Sticky Responsive Navbar**: Brand logo with floral icon, navigation links, category quick dropdown, search modal trigger, wishlist count badge, cart count badge, and admin workspace quick link.
- **Hero Section**: "Handmade with Love" badge, large typography, dual call-to-actions ("Shop Crafts", "Explore Collections"), and featured craft visual with organic shapes.
- **6 Curated Categories**: 
  - Handmade Bouquets
  - Paper Flowers
  - Gift Crafts
  - Decorative Crafts
  - Handmade Idols
  - Custom Creations
- **Featured Products**: Highlighted crafts with quick view, add to cart, wishlist toggle, and star ratings.
- **Shop Catalog (`/shop` & `/shop/:categorySlug`)**:
  - Live search input
  - Category filter pills with dynamic count badges
  - Price sorting (Low to High, High to Low)
  - Rating and Latest sorting
  - "In Stock Only" toggle
  - Empty states with instant filter reset
- **Product Details Page (`/product/:id`)**:
  - High-resolution gallery with thumbnail switcher
  - Pricing with discount badge
  - Quantity selector
  - Add to Craft Bag & Buy Now (instant checkout)
  - Wishlist toggle
  - Craft specifications tabs (Story & Details, Materials & Dimensions, Everlasting Care Guidelines)
  - "You May Also Like" recommendation grid
- **Artisan Storytelling & Values (`/about`)**: Editorial story ("We create thoughtfully handcrafted pieces that turn simple moments into beautiful memories") and 4 pillars of craftsmanship.
- **Artisan Atelier Contact (`/contact`)**: Studio address, phone/WhatsApp, email, and interactive inquiry form.
- **Custom Order CTA & Modal**: "Have something special in mind?" modal for personalized bridal bouquets, customized idols, or special anniversary gifts.
- **Cart Drawer & Checkout**: Slide-out cart drawer with item counter, complimentary gift packaging progress bar (`₹999` threshold), quantity adjustments, and simulated checkout with confetti celebrations.

---

## 🛠️ Complete Frontend-Only Admin Panel (`/admin`)

**No backend, no database, no authentication required.** The entire application is powered by browser `localStorage` with instant cross-component updates.

- **Admin Dashboard (`/admin`)**:
  - Total Products, Total Categories, Featured Crafts, and In-Stock inventory counters.
  - Recently Added products table with fast view and edit links.
  - One-click "Restore Seed Catalog" button to reset the store anytime.
- **Product Management (`/admin/products`)**:
  - Searchable and category-filterable data table.
  - Live toggles for **Featured** status and **In Stock / Made to Order** availability directly from the table.
  - **Delete with Confirmation Modal**: Destructive confirmation dialog before deleting, immediately removing the product from `localStorage` without requiring a page refresh.
- **Add Product Form (`/admin/products/add`)**:
  - Fields for Title, Price, Original Price, Category, Story Description, Materials, Dimensions, Featured toggle, and In-Stock toggle.
  - **Local Computer Image Upload Requirement**:
    - Supports multi-image upload via file picker or drag-and-drop.
    - Files are read via `FileReader` and converted to Base64 data URLs.
    - Automatically compressed and scaled using an HTML5 Canvas helper (`imageOptimizer.js`) before saving into `localStorage` (protects against browser storage quota limits).
    - Preview thumbnails with "Remove" and "Make Primary" controls.
    - Live product card preview on the side as you type.
- **Edit Product Form (`/admin/products/edit/:id`)**:
  - Prefilled with current details from `localStorage`.
  - Replace, reorder, or add new Base64 gallery photos.
  - Instant update reflecting across the shop, featured section, and product details.
- **Collections Management (`/admin/categories`)**:
  - View product counts across all 6 collections.
  - Create new custom categories with cover imagery and descriptions.

---

## 🗄️ LocalStorage Architecture

| LocalStorage Key | Description |
|---|---|
| `craft_products` | Complete array of product objects including Base64 images, categories, specs, ratings, and timestamps. |
| `craft_categories` | Categories metadata (slugs, descriptions, cover images, product tallies). |
| `craft_cart` | Persisted bag items with quantities and gift note details. |
| `craft_wishlist` | Persisted IDs of patron-saved craft pieces. |

## 🏗️ Full-Stack Project Structure

```
Candycraft/
├── frontend/             # React.js + Vite + Tailwind CSS Frontend
│   ├── src/
│   │   ├── components/   # Products, Admin, Common UI components
│   │   ├── context/      # ProductContext & CartWishlistContext
│   │   ├── pages/        # Storefront & Admin management pages
│   │   └── utils/        # API client, email & storage helpers
│   └── package.json
│
├── backend/              # Node.js + Express + MongoDB Backend
│   ├── config/           # MongoDB Mongoose connection handler
│   ├── controllers/      # Products, Categories, Orders, Inquiries, Contact
│   ├── models/           # Mongoose schemas
│   ├── routes/           # Express REST endpoints
│   ├── utils/            # Nodemailer automated email dispatcher
│   ├── data/             # Initial curated seed data
│   ├── seed.js           # Database population script (`npm run seed`)
│   ├── server.js         # Main Express entry point
│   ├── vercel.json       # Vercel serverless deployment config
│   └── package.json
│
└── README.md
```

---

## 🚀 Running the Project Locally

### 1. Start the Backend Server (Node.js & MongoDB)
```bash
cd backend
npm install
npm run dev
```
- Server starts at `http://localhost:5000`
- Owner inquiries inbox: `candycraftssstudio@gmail.com`

### 2. Start the Frontend (React.js & Vite)
```bash
cd frontend
npm install
npm run dev
```
- Storefront: [http://localhost:5173/](http://localhost:5173/)
- Admin Workspace: [http://localhost:5173/admin](http://localhost:5173/admin)

---

## ☁️ Deploying to Vercel

### Step 1: Deploy Backend to Vercel
1. Push repository to GitHub.
2. Go to [vercel.com](https://vercel.com) and import the repository.
3. Select **Root Directory** as `backend`.
4. Under **Environment Variables**, set:
   - `MONGODB_URI`: `mongodb+srv://<user>:<password>@cluster0.mongodb.net/candycrafts?retryWrites=true&w=majority`
   - `OWNER_EMAIL`: `candycraftssstudio@gmail.com`
5. Click **Deploy**. Note the generated backend URL (e.g. `https://candycrafts-api.vercel.app`).

### Step 2: Deploy Frontend to Vercel
1. In Vercel, import the same repository again as a second project.
2. Select **Root Directory** as `frontend`.
3. Under **Environment Variables**, set:
   - `VITE_API_URL`: `https://candycrafts-api.vercel.app/api`
4. Click **Deploy**. Your full-stack Candy Crafts app is live!

