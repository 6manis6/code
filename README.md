# Kurama Collectibles - Anime Merchandise E-Commerce Store

A full-stack e-commerce website built with Next.js 14, MongoDB Atlas, and Tailwind CSS for selling anime merchandise including figures, clothing, and accessories.

## Features

### User Features

- 🛍️ Browse anime merchandise by categories (Clothing, Figures, Accessories)
- 🛒 Add items to cart and manage quantities
- 📱 Responsive design with dark/light theme toggle
- ✅ Simple checkout process with name and phone number
- 🎨 Beautiful UI matching the provided design mockup

### Admin Features

- 🔐 Secure admin login
- ➕ Add new products with image upload (ImgBB integration)
- 📦 View and manage all products
- 📋 View all orders with status management
- 🎯 Mark products as featured
- 📊 Dashboard with statistics

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS
- **Database**: MongoDB Atlas
- **Image Storage**: ImgBB API
- **Icons**: React Icons
- **Notifications**: React Hot Toast

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js 18+ and npm/yarn
- MongoDB Atlas account
- ImgBB account (for image uploads)

## Installation

1. **Clone the repository**

   ```bash
   cd kurama
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Update the `.env.local` file with your credentials:

   ```env
   # MongoDB Atlas Connection String
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kurama?retryWrites=true&w=majority

   # ImgBB API Key (Get from https://api.imgbb.com/)
   IMGBB_API_KEY=your_imgbb_api_key_here

   # Contact form email forwarding (Gmail SMTP)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your_gmail_address@gmail.com
   SMTP_PASS=your_gmail_app_password
   CONTACT_RECEIVER_EMAIL=your_gmail_address@gmail.com
   CONTACT_FROM_EMAIL=your_gmail_address@gmail.com

   # Admin Credentials
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=admin123

   # For client-side access
   NEXT_PUBLIC_ADMIN_USERNAME=admin
   NEXT_PUBLIC_ADMIN_PASSWORD=admin123
   ```

4. **Configure MongoDB Atlas**
   - Create a new cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a database named `kurama`
   - Get your connection string and add it to `.env.local`
   - Whitelist your IP address or allow access from anywhere (0.0.0.0/0)

5. **Get ImgBB API Key**
   - Sign up at [ImgBB](https://imgbb.com/)
   - Go to [API page](https://api.imgbb.com/) and get your API key
   - Add it to `.env.local`

6. **Configure Gmail forwarding for contact form**
   - Enable 2-Step Verification on your Google account
   - Create an App Password in Google Account security settings
   - Use that App Password as `SMTP_PASS` (not your normal Gmail password)
   - Keep `SMTP_USER`, `CONTACT_RECEIVER_EMAIL`, and `CONTACT_FROM_EMAIL` as your Gmail address

## Running the Application

1. **Development mode**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser

2. **Build for production**
   ```bash
   npm run build
   npm start
   ```

## Usage

### For Customers

1. Visit the homepage at `http://localhost:3000`
2. Browse products by category or view featured items
3. Click "Add to Cart" on any product
4. Navigate to cart using the cart icon in header
5. Proceed to checkout and enter your name and phone number
6. Place your order

### For Admin

1. Go to `http://localhost:3000/admin`
2. Login with credentials:
   - Username: `admin`
   - Password: `admin123`
3. View dashboard with all products and orders
4. Click "Add Product" to upload new items
5. Manage order statuses (Pending, Processing, Completed, Cancelled)
6. Delete products as needed

## Project Structure

```
kurama/
├── src/
│   ├── app/
│   │   ├── admin/              # Admin pages
│   │   ├── api/                # API routes
│   │   ├── cart/               # Cart page
│   │   ├── collections/        # Products listing
│   │   ├── about/              # About page
│   │   ├── contact/            # Contact page
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Homepage
│   │   └── globals.css         # Global styles
│   ├── components/             # Reusable components
│   ├── contexts/               # React contexts
│   ├── lib/                    # Utility functions
│   ├── models/                 # MongoDB models
│   └── types/                  # TypeScript types
├── public/                     # Static files
├── .env.local                  # Environment variables
├── tailwind.config.ts          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies
```

## API Routes

- `GET /api/products` - Get all products (with optional filters)
- `POST /api/products` - Create new product
- `GET /api/products/[id]` - Get single product
- `PUT /api/products/[id]` - Update product
- `DELETE /api/products/[id]` - Delete product
- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create new order
- `PATCH /api/orders/[id]` - Update order status
- `POST /api/upload` - Upload image to ImgBB

## Database Schema

### Product

```typescript
{
  name: string;
  description: string;
  price: number;
  category: "clothing" | "figures" | "accessories";
  image: string;
  stock: number;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Order

```typescript
{
  customerName: string
  customerPhone: string
  items: [{
    productId: ObjectId
    productName: string
    productImage: string
    quantity: number
    price: number
  }]
  totalAmount: number
  status: 'pending' | 'processing' | 'completed' | 'cancelled'
  createdAt: Date
  updatedAt: Date
}
```

## Features Walkthrough

### Theme Toggle

- Click the sun/moon icon in the header to switch between light and dark modes
- Theme preference is saved in localStorage

### Cart Management

- Cart data persists in localStorage
- Real-time cart item count in header
- Update quantities or remove items in cart page

### Admin Dashboard

- View total products and orders count
- Products table with delete functionality
- Orders list with status dropdown for management

### Image Upload

- Drag and drop or click to upload product images
- Images are automatically uploaded to ImgBB
- Preview before upload

## Customization

### Changing Colors

Edit `tailwind.config.ts`:

```typescript
colors: {
  primary: {
    DEFAULT: '#FF6B35',  // Change this
    dark: '#E85D2E',     // And this
  },
}
```

### Admin Credentials

Update in `.env.local`:

```env
ADMIN_USERNAME=your_username
ADMIN_PASSWORD=your_password
```

## Security Notes

⚠️ **Important**: This is a demo application. For production use:

- Implement proper authentication (NextAuth.js, JWT, etc.)
- Add server-side session management
- Validate all inputs
- Add rate limiting
- Use HTTPS
- Implement CSRF protection
- Add proper error handling
- Sanitize user inputs

## Troubleshooting

**MongoDB Connection Error**

- Verify your MongoDB URI is correct
- Check if your IP is whitelisted in MongoDB Atlas
- Ensure database user has proper permissions

**ImgBB Upload Failed**

- Verify API key is correct
- Check image size (ImgBB has limits)
- Ensure internet connection is stable

**Build Errors**

- Delete `node_modules` and `.next` folders
- Run `npm install` again
- Check Node.js version (18+ required)

## License

This project is open source and available under the MIT License.

## Support

For issues or questions, please open an issue on GitHub or contact support@kurama.com

---

Built with ❤️ for the anime community
