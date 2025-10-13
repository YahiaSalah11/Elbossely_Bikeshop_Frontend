# El Bossely Bikes - Backend Integration Guide

This application is now fully integrated with your Node.js backend. Follow the steps below to get everything running.

## Prerequisites

- Node.js (v16 or higher)
- Your Node.js backend running
- MongoDB database

## Setup Instructions

### 1. Configure API URL

**Option A: Using Environment Variables (Recommended for local development)**

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit the `.env` file and set your backend API URL:

```
VITE_API_URL=http://localhost:5000/api
```

**Option B: Direct Configuration (For this environment)**

If environment variables aren't working, edit `/lib/api.ts` directly and change the API_BASE_URL:

```typescript
const API_BASE_URL = 'http://localhost:5000/api'; // Change this to your backend URL
```

Replace `http://localhost:5000/api` with your actual backend URL.

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Development Server

```bash
npm run dev
```

The application will start on `http://localhost:5173` (or the next available port).

## Backend Requirements

Your backend must be running and accessible at the URL specified in `.env`. Make sure:

1. **MongoDB is running** and connected
2. **Backend server is running** (typically on port 5000)
3. **CORS is enabled** on your backend to allow requests from `http://localhost:5173`

### CORS Configuration Example

In your backend `server.js` or `app.js`, add:

```javascript
import cors from 'cors';

app.use(cors({
  origin: 'http://localhost:5173', // or '*' for development
  credentials: true
}));
```

## API Endpoints Used

### Bikes

- `GET /api/bikes/featured` - Get featured bikes
- `POST /api/bikes/search` - Search bikes with filters
- `POST /api/bikes/bikesbytype` - Get bikes by type
- `POST /api/bikes/manufacturers` - Get unique manufacturers
- `POST /api/bikes/models` - Get models (optionally filtered by manufacturer)
- `POST /api/bikes/years` - Get unique years
- `POST /api/bikes/add` - Add a new bike (with file upload)
- `DELETE /api/bikes/deletebike/:id` - Delete a bike
- `DELETE /api/bikes/deleteallbikes` - Delete all bikes

### Orders

- `GET /api/orders` - Get all orders
- `GET /api/orders/search?searchTerm=...` - Search orders
- `POST /api/orders` - Create a new order
- `DELETE /api/orders/:id` - Delete an order

## Features

### User Page

- Browse featured motorcycles
- Filter bikes by type (Chinese, Indian, Electric, Japanese)
- Search bikes by manufacturer, type, and condition
- View detailed bike information with image gallery
- Place orders for motorcycles

### Admin Panel (Password: admin123)

- **Add Motorcycles**: Upload up to 6 pictures per bike
- **Manage Inventory**: View, filter, and delete bikes
- **Manage Orders**: View customer orders, add new orders, delete orders
- **Filter Options**: Filter bikes by type and condition

## Data Structure

### Bike Model

```javascript
{
  _id: string,
  name: string,
  manufacturer: string,
  model: string,
  year: number,
  newOrUsed: 'new' | 'used',
  specs: string,
  isFeatured: boolean,
  pictures: string[],
  bikeType: 'chinese' | 'indian' | 'electric' | 'japanese'
}
```

### Order Model

```javascript
{
  _id: string,
  bike: ObjectId (ref: 'Bike'),
  user: ObjectId (ref: 'User', optional),
  contactInfo: {
    name: string,
    phone: string,
    email?: string
  },
  createdAt: timestamp,
  updatedAt: timestamp
}
```

## File Uploads

The application uses `FormData` to upload bike images to your backend. Your backend should:

1. Use `multer` middleware to handle file uploads
2. Support up to 6 images per bike
3. Return image URLs in the `pictures` array

Example multer configuration (already in your backend):

```javascript
import multer from 'multer';
const upload = multer({ dest: 'uploads/' });

router.post('/add', upload.array('pictures', 6), addBikeController);
```

## Troubleshooting

### CORS Errors

If you see CORS errors in the browser console:

1. Make sure CORS is enabled on your backend
2. Check that the backend URL in `.env` is correct
3. Ensure your backend is running

### Connection Refused

If you see "Connection Refused" errors:

1. Verify your backend is running
2. Check the API URL in `.env`
3. Try accessing the backend directly in your browser (e.g., `http://localhost:5000/api/bikes/featured`)

### Images Not Loading

If bike images don't load:

1. Check that image URLs returned by the backend are accessible
2. Verify the `pictures` array in bike documents contains valid URLs
3. Ensure your backend serves uploaded images correctly

### 404 Errors

If you get 404 errors for API endpoints:

1. Verify the route paths in your backend match what's expected
2. Check that your backend router is properly mounted (e.g., `app.use('/api/bikes', bikeRoutes)`)

## Development vs Production

### Development

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`
- Use `.env` with development URLs

### Production

1. Build the frontend: `npm run build`
2. Serve the `dist` folder with your backend or a static file server
3. Update `.env` with production API URL before building

## Next Steps

1. Start your MongoDB database
2. Start your Node.js backend server
3. Configure the `.env` file with your backend URL
4. Run `npm install && npm run dev`
5. Access the application at `http://localhost:5173`

Happy coding! 🏍️