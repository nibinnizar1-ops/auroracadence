# Product Requirements Document (PRD)
## Jewelry E-Commerce Platform

### Project Overview
A modern, responsive jewelry e-commerce platform built with React, TypeScript, and Tailwind CSS, integrated with Shopify for product management and Zwitch for payment processing.

---

## Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: shadcn/ui components
- **State Management**: Zustand
- **Routing**: React Router DOM v6
- **Typography**: Open Sans (brand requirement)

### Backend & Infrastructure
- **Backend Platform**: Lovable Cloud (Supabase)
- **Product Management**: Shopify Storefront API
- **Payment Gateway**: Zwitch (Primary)
- **Database**: PostgreSQL (via Lovable Cloud)
- **Authentication**: Mobile number-based auth with dialog overlays
- **Edge Functions**: Serverless functions for payment processing

---

## Core Features

### 1. Product Catalog
- **Shopify Integration**: Products fetched from Shopify Storefront API
- **Product Display**: Grid layout with product cards
- **Product Details**: Dedicated product detail pages with:
  - Image galleries
  - Variant selection (size, material, color)
  - Price display
  - Add to cart functionality
  - Add to wishlist functionality

### 2. Category Navigation
- **Collections Page**: Browse all collections
- **Occasion-Based Categories**:
  - Daily Wear
  - Office Wear
  - Party Wear
  - Date Night
  - Wedding Wear
- **New Arrivals**: Featured new products

### 3. Shopping Cart
- **Cart Drawer**: Slide-out cart interface
- **Features**:
  - Add/remove items
  - Quantity adjustment
  - Real-time price calculation
  - Persistent cart state (Zustand)
  - Empty cart state handling

### 4. Wishlist
- **Functionality**:
  - Add/remove products from wishlist
  - Dedicated wishlist page
  - Persistent wishlist state
  - Quick add to cart from wishlist

### 5. Checkout & Payments
- **Custom Checkout Page** (`/checkout`)
- **Shipping Form**:
  - Full name, email, phone (required)
  - Address, city, state, pincode
  - Form validation
- **Order Summary**:
  - Line items with images
  - Quantity and pricing
  - Subtotal, shipping, tax calculations
- **Payment Integration**:
  - **Primary Gateway**: Zwitch Layer.js
  - Access Key: `ak_live_C1t1TxfMFXM6c8WVFlR7sILGWXIQNa`
  - Payment flow:
    1. Create payment token (backend edge function)
    2. Load Zwitch Layer.js SDK
    3. Open Zwitch payment UI
    4. Verify payment (backend edge function)
    5. Clear cart and redirect on success

### 6. Authentication
- **Mobile Number-Based Authentication**
- **UI Pattern**: Dialog overlays (not separate pages)
- **Components**:
  - Login Dialog
  - Signup Dialog
- **User Profile**: Profile page for authenticated users

### 7. Content Pages
- **About Page**: Company information
- **Contact Page**: Contact form and store information
- **Store Locations**: Physical store addresses
- **404 Page**: Custom not found page

### 8. Homepage Features
- **Hero Carousel**: Multi-image carousel with jewelry photography
- **Category Showcase**: Visual category navigation
- **Gift Guide**: Curated gift suggestions (mom, wife, girlfriend, sister, daughter, friend)
- **Influencer Showcase**: Featured testimonials with real customer images
- **Review Section**: Customer reviews and ratings
- **Offer Banner**: Promotional banners
- **Luxury Collection Banner**: Featured premium collections

### 9. Design System
- **Font Family**: Open Sans (all text elements)
- **Color System**: HSL-based semantic tokens
- **Design Tokens**: Defined in `index.css` and `tailwind.config.ts`
- **Component Variants**: Customized shadcn/ui components
- **Responsive Design**: Mobile-first approach
- **Theme Support**: Light/dark mode capabilities

---

## Data Architecture

### Database Tables (Lovable Cloud)
- **orders**: Store order information
  - Order details (number, status, payment status)
  - Customer information (name, email, phone)
  - Shipping and billing addresses
  - Line items (JSON)
  - Payment metadata (Zwitch payment IDs)
  - Timestamps (created_at, updated_at)

### State Management (Zustand)
- **authStore**: User authentication state
- **cartStore**: Shopping cart items and operations
- **wishlistStore**: Wishlist items and operations

---

## Edge Functions

### 1. create-razorpay-order (now Zwitch)
**Purpose**: Create payment token for Zwitch checkout
- **Input**:
  - Amount (in paise)
  - Currency
  - Customer information
  - Cart items
- **Process**:
  - Create order in database
  - Generate payment token via Zwitch API
  - Return payment token and access key
- **Output**: Payment token, access key, database order ID

### 2. verify-razorpay-payment (now Zwitch)
**Purpose**: Verify and capture Zwitch payment
- **Input**:
  - Payment token ID
  - Payment ID
  - Payment status
  - Database order ID
- **Process**:
  - Verify payment status with Zwitch
  - Update order in database
  - Mark as paid/failed
- **Output**: Verification status

---

## User Flows

### Shopping Flow
1. Browse products (homepage, collections, categories)
2. View product details
3. Select variants (size, color, material)
4. Add to cart or wishlist
5. Review cart in drawer
6. Proceed to checkout
7. Fill shipping information
8. Complete payment via Zwitch
9. Receive confirmation

### Authentication Flow (When Implemented)
1. Click login/signup in navigation
2. Dialog overlay appears
3. Enter mobile number
4. Complete authentication
5. Access profile and order history

---

## Key Assets

### Image Categories
- Hero carousel images (`hero-jewelry-1/2/3.jpg`)
- Gift guide images (mom, wife, girlfriend, sister, daughter, friend)
  - Card images (`card-*.jpg`)
  - Gift images (`gift-*.jpg`)
  - Real customer images (`real-*.jpg`)
- Banner images:
  - Collection banner (`banner-collection.jpg`)
  - Luxury banner (`banner-luxury.jpg`)

---

## API Integrations

### Shopify Storefront API
- **File**: `src/lib/shopify.ts`
- **Operations**:
  - Fetch collections
  - Fetch products
  - Product search
  - Product filtering

### Zwitch Payment API
- **Access Key**: `ak_live_C1t1TxfMFXM6c8WVFlR7sILGWXIQNa`
- **Secret Key**: Stored in backend secrets
- **Operations**:
  - Create payment tokens
  - Process payments
  - Verify payment status

---

## Environment Variables
- `VITE_SUPABASE_URL`: Lovable Cloud URL
- `VITE_SUPABASE_PUBLISHABLE_KEY`: Public API key
- `VITE_SUPABASE_PROJECT_ID`: Project identifier
- `ZWITCH_ACCESS_KEY`: Zwitch API access key (backend)
- `ZWITCH_SECRET_KEY`: Zwitch API secret key (backend)

---

## Routing Structure

```
/ - Homepage
/collections - All collections
/new-arrivals - New products
/daily-wear - Daily wear jewelry
/office-wear - Office wear jewelry
/party-wear - Party wear jewelry
/date-night - Date night jewelry
/wedding-wear - Wedding wear jewelry
/product/:id - Product detail page
/checkout - Checkout page
/wishlist - Wishlist page
/profile - User profile
/about - About page
/contact - Contact page
* - 404 Not Found
```

---

## Current Status

### ✅ Completed Features
- Shopify product integration
- Shopping cart functionality
- Wishlist functionality
- Custom checkout page
- Zwitch payment gateway integration
- Mobile dialog authentication UI
- Responsive design with Open Sans typography
- Category navigation
- Homepage with all sections
- Order management in database

### 🔄 In Progress / Future Enhancements
- Complete authentication flow implementation
- Order tracking and history
- User profile management
- Email notifications
- Inventory management
- Product reviews system
- Advanced filtering and search
- Analytics integration

---

## Design Principles

1. **Brand Consistency**: Open Sans typography throughout
2. **Mobile-First**: Responsive design for all screen sizes
3. **User Experience**: Minimal friction in checkout process
4. **Performance**: Optimized images and lazy loading
5. **Accessibility**: Semantic HTML and ARIA labels
6. **Maintainability**: Component-based architecture with clear separation of concerns

---

## Security Considerations

- Secure payment processing via Zwitch
- Environment variables for sensitive data
- Backend validation for all transactions
- RLS policies on database tables
- HTTPS for all communications

---

**Document Version**: 1.0  
**Last Updated**: December 2025  
**Project URL**: https://lovable.dev/projects/386d8789-89fa-41ab-9000-c6ae841858aa
