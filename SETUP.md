# Quick Setup Guide

Follow these steps to get your Kurama Collectibles store up and running:

## Step 1: MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up or log in
3. Create a new cluster (free tier is fine)
4. Click "Connect" on your cluster
5. Choose "Connect your application"
6. Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)
7. Replace `<password>` with your database password
8. Add `/kurama` after `.net/` and before the `?`

Example: `mongodb+srv://user:pass123@cluster0.xxxxx.mongodb.net/kurama?retryWrites=true&w=majority`

## Step 2: ImgBB API Key

1. Go to [ImgBB](https://imgbb.com/)
2. Sign up or log in
3. Visit [API page](https://api.imgbb.com/)
4. Copy your API key

## Step 3: Environment Variables

Open `.env.local` and update:

```env
MONGODB_URI=your_mongodb_connection_string_from_step_1
IMGBB_API_KEY=your_api_key_from_step_2
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_gmail_address@gmail.com
SMTP_PASS=your_gmail_app_password
CONTACT_RECEIVER_EMAIL=your_gmail_address@gmail.com
CONTACT_FROM_EMAIL=your_gmail_address@gmail.com
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
NEXT_PUBLIC_ADMIN_USERNAME=admin
NEXT_PUBLIC_ADMIN_PASSWORD=admin123
```

## Step 4: Gmail App Password (for Contact Form Emails)

1. Open your Google Account security settings
2. Enable 2-Step Verification (required)
3. Create an App Password for Mail
4. Use this App Password as `SMTP_PASS` in `.env.local`
5. Do not use your normal Gmail password in `SMTP_PASS`

## Step 5: Install and Run

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

## Step 6: Access Your Site

- **Homepage**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin
  - Username: admin
  - Password: admin123

## First Steps

1. Log into admin panel
2. Add some products
3. Mark some as "featured" to show on homepage
4. Test the shopping cart and checkout

## Common Issues

**"MongoDB connection failed"**

- Check if your IP is whitelisted in MongoDB Atlas Network Access
- Verify the connection string is correct

**"Image upload failed"**

- Verify ImgBB API key is correct
- Check image file size (max 32MB for free tier)

**Port 3000 already in use**

```bash
# Use a different port
npm run dev -- -p 3001
```

## Need Help?

Check the full README.md for detailed documentation and troubleshooting.
