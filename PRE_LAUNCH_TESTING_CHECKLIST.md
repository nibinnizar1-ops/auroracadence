# Pre-Launch Testing Checklist

## 🎯 Complete Testing Guide for Aurora Cadence

Use this checklist to ensure everything is working perfectly before going live.

---

## 1. Authentication & User Management

### Google Sign-In
- [ ] **Sign up with Google**
  - Click "Sign up with Google" from signup page
  - Complete Google authentication
  - Verify redirect to homepage
  - Verify user is logged in (check profile icon)
  - Verify no infinite redirect loop

- [ ] **Sign in with Google (existing user)**
  - Log out
  - Click "Sign in with Google" from login page
  - Verify successful login
  - Verify redirect to homepage

- [ ] **Sign out**
  - Click profile icon → Sign out
  - Verify user is logged out
  - Verify redirect to homepage

### User Profile
- [ ] **View Profile**
  - Navigate to Profile page
  - Verify user information displays correctly
  - Verify email/name from Google account shows

- [ ] **Update Profile**
  - Edit name/phone number
  - Save changes
  - Verify changes persist

---

## 2. Product Browsing & Discovery

### Homepage
- [ ] **Hero Carousel**
  - Verify banners display correctly
  - Verify auto-rotation works
  - Verify manual navigation (prev/next) works
  - Click on banner → verify link works

- [ ] **EVERYDAY LUXURY JEWELLERY Section**
  - Verify category links display (6 categories)
  - Verify product grid shows below categories (12 products)
  - Click on category → verify navigation works
  - Click on product → verify product detail page opens

- [ ] **Collection Banner**
  - Verify banner displays
  - Click banner → verify link works

- [ ] **Aurora's TOP STYLES**
  - Verify filter buttons work (All, Necklaces, Rings, Earrings, Bracelets)
  - Verify products filter correctly
  - Verify products display with images, titles, prices
  - Click product → verify navigation

- [ ] **LUXURY MOODS Carousel**
  - Verify carousel displays
  - Verify navigation arrows work
  - Click on category → verify navigation

- [ ] **Our Collection**
  - Verify products display
  - Verify pagination/loading works

- [ ] **Gift Guide**
  - Verify all gift categories display
  - Click on category → verify navigation

- [ ] **Influencer Showcase**
  - Verify influencers display
  - Verify images load correctly

- [ ] **Store Locations**
  - Verify store locations display
  - Verify map/address information shows

### Product Pages
- [ ] **Product Detail Page**
  - Navigate to any product
  - Verify product images display
  - Verify product title, price, description show
  - Verify variant selection works (if applicable)
  - Verify "Add to Cart" button works
  - Verify "Add to Wishlist" button works
  - Verify breadcrumb navigation works

- [ ] **Product Grids**
  - Verify all product images load
  - Verify product titles and prices display
  - Verify hover effects work
  - Verify "Add to Cart" from grid works
  - Verify "Add to Wishlist" from grid works

### Category Pages
- [ ] **New Arrivals**
  - Navigate to /new-arrivals
  - Verify products display
  - Verify filtering works

- [ ] **Collections**
  - Navigate to /collections
  - Verify all products display
  - Verify category filters work

- [ ] **Luxury Moods Pages**
  - Test: Office Wear, Daily Wear, Party Wear, Date Night, Wedding Wear
  - Verify each page loads correctly
  - Verify products display for each category

---

## 3. Shopping Cart

### Add to Cart
- [ ] **From Product Detail Page**
  - Add product to cart
  - Verify toast notification appears (centered)
  - Verify cart icon updates with count
  - Click cart icon → verify product appears

- [ ] **From Product Grid**
  - Add product from homepage grid
  - Verify toast notification appears (centered)
  - Verify cart updates

- [ ] **Multiple Products**
  - Add 3-4 different products
  - Verify all appear in cart
  - Verify quantities are correct

### Cart Management
- [ ] **View Cart**
  - Open cart drawer/sidebar
  - Verify all items display
  - Verify quantities, prices, totals show correctly

- [ ] **Update Quantity**
  - Increase quantity
  - Decrease quantity
  - Remove item
  - Verify totals update correctly

- [ ] **Cart Persistence**
  - Add items to cart
  - Refresh page
  - Verify cart items persist
  - Log out and log back in
  - Verify cart items persist (if synced with account)

---

## 4. Wishlist

### Add to Wishlist
- [ ] **From Product Detail**
  - Click heart icon
  - Verify toast notification (centered)
  - Verify heart icon fills (red)

- [ ] **From Product Grid**
  - Click heart icon on product card
  - Verify toast notification
  - Verify icon state updates

### Wishlist Page
- [ ] **View Wishlist**
  - Navigate to /wishlist
  - Verify all wishlisted items display
  - Verify images, titles, prices show

- [ ] **Remove from Wishlist**
  - Click heart icon to remove
  - Verify item disappears
  - Verify toast notification

- [ ] **Add to Cart from Wishlist**
  - Click "Add to Cart" from wishlist
  - Verify item moves to cart
  - Verify toast notification

---

## 5. Checkout & Payment

### Checkout Process
- [ ] **Navigate to Checkout**
  - Add items to cart
  - Click "Checkout" or cart icon
  - Verify checkout page loads

- [ ] **Shipping Address**
  - Enter shipping address
  - Verify form validation works
  - Save address
  - Verify address persists

- [ ] **Order Summary**
  - Verify cart items display
  - Verify subtotal, shipping, tax, total calculate correctly
  - Verify coupon code field works (if applicable)

- [ ] **Coupon Codes**
  - Enter valid coupon code
  - Verify discount applies
  - Verify total updates
  - Test invalid coupon code
  - Verify error message shows

### Payment Integration (Zwitch)
- [ ] **Initiate Payment**
  - Click "Pay Now" button
  - Verify payment modal/checkout opens
  - Verify Zwitch Layer.js SDK loads (sandbox)
  - Verify payment form displays

- [ ] **Complete Payment (Test Mode)**
  - Use test card details
  - Complete payment
  - Verify redirect to success page
  - Verify order confirmation shows
  - Verify order ID displays

- [ ] **Payment Failure**
  - Cancel payment or use invalid card
  - Verify redirect to failure page
  - Verify error message displays
  - Verify order ID shows for reference

- [ ] **Payment Verification**
  - After successful payment
  - Verify order status updates in database
  - Verify inventory deducted
  - Verify order email sent (if configured)

### Order Success/Failure Pages
- [ ] **Order Success Page**
  - Complete successful payment
  - Verify success page displays
  - Verify order details show
  - Verify "Continue Shopping" button works
  - Verify "View Orders" button works

- [ ] **Payment Failed Page**
  - Trigger payment failure
  - Verify failure page displays
  - Verify error message shows
  - Verify "Try Again" button works
  - Verify "Back to Home" button works

---

## 6. Order Management

### View Orders
- [ ] **Order History**
  - Navigate to Profile → Orders (if available)
  - Verify past orders display
  - Verify order details show

- [ ] **Order Details**
  - Click on order
  - Verify order items, prices, status show
  - Verify shipping address shows
  - Verify payment status shows

---

## 7. Navigation & UI/UX

### Navigation
- [ ] **Main Navigation**
  - Verify all links work
  - Verify logo links to homepage
  - Verify cart icon shows count
  - Verify profile icon shows when logged in

- [ ] **Mobile Navigation**
  - Test on mobile device/resize
  - Verify hamburger menu works
  - Verify all links accessible

- [ ] **Footer**
  - Verify all footer links work
  - Verify social media links work
  - Verify contact information shows

### Responsive Design
- [ ] **Desktop (1920px+)**
  - Verify layout looks good
  - Verify all elements visible

- [ ] **Tablet (768px - 1024px)**
  - Verify responsive layout
  - Verify navigation works

- [ ] **Mobile (320px - 767px)**
  - Verify mobile layout
  - Verify touch interactions work
  - Verify text readable
  - Verify buttons clickable

### Loading States
- [ ] **Product Loading**
  - Verify loading skeletons show
  - Verify smooth transitions

- [ ] **Button Loading States**
  - Verify loading spinners show
  - Verify buttons disabled during actions

### Toast Notifications
- [ ] **Notification Position**
  - Trigger various toasts (add to cart, wishlist, etc.)
  - Verify all toasts appear **centered** on screen
  - Verify toasts auto-dismiss
  - Verify toast styling looks good

---

## 8. Admin Panel

### Authentication
- [ ] **Admin Login**
  - Access /admin
  - Verify admin authentication required
  - Verify unauthorized users redirected

### Product Management
- [ ] **View Products**
  - Navigate to Products page
  - Verify all products list
  - Verify search/filter works

- [ ] **Add Product**
  - Create new product
  - Upload images
  - Set price, description, categories
  - Save product
  - Verify product appears on frontend

- [ ] **Edit Product**
  - Edit existing product
  - Update details
  - Save changes
  - Verify changes reflect on frontend

- [ ] **Delete Product**
  - Delete product
  - Verify product removed from frontend

### Order Management
- [ ] **View Orders**
  - Navigate to Orders page
  - Verify all orders display
  - Verify order details show

- [ ] **Update Order Status**
  - Change order status
  - Verify status updates
  - Verify customer notification (if configured)

### Payment Gateway
- [ ] **View Payment Gateways**
  - Navigate to Payment Gateways
  - Verify Zwitch configuration shows
  - Verify credentials are secure (not visible)

### Media Management
- [ ] **Banners**
  - Upload/edit hero banners
  - Verify banners appear on homepage
  - Verify collection banner works
  - Verify luxury banner works

- [ ] **Category Showcase**
  - Edit category showcase items
  - Verify changes reflect on homepage

- [ ] **Luxury Moods**
  - Edit luxury mood categories
  - Verify carousel updates

- [ ] **Gift Guide**
  - Edit gift guide items
  - Verify updates on homepage

- [ ] **Influencers**
  - Edit influencer showcase
  - Verify updates on homepage

- [ ] **Stores**
  - Edit store locations
  - Verify updates on homepage

### Coupons
- [ ] **Create Coupon**
  - Create new coupon
  - Set discount, expiry
  - Verify coupon works at checkout

- [ ] **Edit/Delete Coupon**
  - Edit coupon
  - Delete coupon
  - Verify changes work

---

## 9. Performance & Technical

### Page Load Speed
- [ ] **Homepage**
  - Measure load time (< 3 seconds)
  - Verify images lazy load
  - Verify no layout shift

- [ ] **Product Pages**
  - Measure load time
  - Verify images load efficiently

### Error Handling
- [ ] **404 Page**
  - Navigate to invalid URL
  - Verify 404 page displays
  - Verify "Back to Home" works

- [ ] **Network Errors**
  - Simulate network failure
  - Verify error messages show
  - Verify app doesn't crash

### Browser Compatibility
- [ ] **Chrome**
  - Test all major features
  - Verify no console errors

- [ ] **Safari**
  - Test all major features
  - Verify no console errors

- [ ] **Firefox**
  - Test all major features
  - Verify no console errors

- [ ] **Edge**
  - Test all major features
  - Verify no console errors

### Mobile Browsers
- [ ] **iOS Safari**
  - Test on iPhone
  - Verify all features work

- [ ] **Chrome Mobile**
  - Test on Android
  - Verify all features work

---

## 10. Security & Data

### Data Validation
- [ ] **Form Validation**
  - Test all forms
  - Verify required fields work
  - Verify email/phone validation
  - Verify password requirements

### Payment Security
- [ ] **Payment Data**
  - Verify no card details stored
  - Verify payment tokens secure
  - Verify SSL/HTTPS works (production)

### User Data
- [ ] **Privacy**
  - Verify user data secure
  - Verify GDPR compliance (if applicable)

---

## 11. Edge Cases

### Empty States
- [ ] **Empty Cart**
  - Verify empty cart message
  - Verify "Continue Shopping" works

- [ ] **Empty Wishlist**
  - Verify empty wishlist message

- [ ] **No Products**
  - Verify "No products" message

### Edge Cases
- [ ] **Very Long Product Names**
  - Verify text truncates properly

- [ ] **Special Characters**
  - Test with special characters in names/descriptions
  - Verify no breaking

- [ ] **Large Images**
  - Upload large product images
  - Verify optimization works

---

## 12. Final Checks

### Pre-Launch
- [ ] **Environment Variables**
  - Verify all API keys configured
  - Verify Supabase credentials correct
  - Verify Zwitch credentials correct (sandbox/live)

- [ ] **Database**
  - Verify all tables exist
  - Verify RLS policies correct
  - Verify indexes created

- [ ] **Edge Functions**
  - Verify create-payment-order deployed
  - Verify verify-payment deployed
  - Verify functions have correct secrets

- [ ] **Domain & SSL**
  - Verify domain configured
  - Verify SSL certificate active
  - Verify HTTPS works

- [ ] **Analytics**
  - Verify tracking codes added (if applicable)
  - Verify conversion tracking works

- [ ] **Backup**
  - Verify database backup configured
  - Verify backup schedule set

---

## ✅ Sign-Off

**Tested By:** _________________  
**Date:** _________________  
**Status:** ☐ Ready for Launch ☐ Needs Fixes

**Notes:**
_________________________________________________
_________________________________________________
_________________________________________________

---

## 🐛 Issues Found

Document any issues found during testing:

1. **Issue:** _________________  
   **Severity:** ☐ Critical ☐ High ☐ Medium ☐ Low  
   **Status:** ☐ Fixed ☐ Pending

2. **Issue:** _________________  
   **Severity:** ☐ Critical ☐ High ☐ Medium ☐ Low  
   **Status:** ☐ Fixed ☐ Pending

---

**Good luck with your launch! 🚀**

