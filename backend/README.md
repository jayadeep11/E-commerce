# KORE Backend

## Prerequisites
- Node.js
- MongoDB (running locally or a cloud instance)

## Setup
1. Install dependencies: `npm install`
2. Create/Update `.env` file with your `MONGO_URI`.
3. Seed the database: `node seedProducts.js`
4. Start the server: `npm start` (or `npm run dev` with nodemon)

## API Endpoints
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
