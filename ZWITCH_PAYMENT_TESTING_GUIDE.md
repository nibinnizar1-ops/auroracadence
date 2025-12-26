# Zwitch Payment Integration - Complete Testing Guide

## ✅ Pre-Testing Checklist

### Backend Setup
- [x] **Supabase Vault Secrets Configured**
  - `ZWITCH_ACCESS_KEY` - Your sandbox access key
  - `ZWITCH_SECRET_KEY` - Your sandbox secret key
  - Both secrets are set in: Project Settings → Edge Functions → Secrets

- [x] **Edge Functions Deployed**
  - `create-payment-order` - Deployed and using sandbox endpoint
  - `verify-payment` - Deployed and using sandbox endpoint
  - Both functions read credentials from Supabase Vault
  - Both functions use: `https://api.zwitch.io/v1/pg/sandbox/payment_token`

- [x] **Code Configuration**
  - Environment detection removed (always sandbox)
  - Sandbox endpoint hardcoded
  - Frontend loads sandbox Layer.js SDK

### Frontend Setup
- [x] **Routes Added**
  - `/order-success` - Order confirmation page
  - `/payment-failed` - Payment failure page
  - Routes added to `App.tsx`

- [x] **Checkout Integration**
  - Loads sandbox Layer.js SDK
  - Redirects to success page on payment success
  - Redirects to failed page on payment failure/cancellation

## 🧪 Step-by-Step Test Flow

### Test 1: Basic Payment Flow (Success)

**Steps:**
1. **Add Items to Cart**
   - Go to homepage
   - Click on any product
   - Select variant (if applicable)
   - Click "Add to Cart"
   - Add 1-2 more items

2. **Go to Checkout**
   - Click cart icon
   - Click "Checkout" button
   - Verify cart items are displayed
   - Verify total amount is correct

3. **Fill Customer Details**
   - Name: Test User
   - Email: test@example.com
   - Phone: 9999999999
   - Address: Test Address
   - City: Test City
   - State: Test State
   - Pincode: 123456

4. **Apply Coupon (Optional)**
   - Enter coupon code if available
   - Verify discount is applied

5. **Click "Pay Now"**
   - Should show "Processing..." button
   - Should load sandbox Layer.js SDK
   - Zwitch payment modal should open

6. **Complete Payment in Sandbox**
   - Use Zwitch sandbox test credentials
   - Complete payment successfully
   - Payment modal should close

7. **Verify Success**
   - Should redirect to `/order-success`
   - Should show order confirmation
   - Should display order number
   - Should show order summary
   - Cart should be cleared
   - Can click "Continue Shopping" or "View Orders"

**Expected Results:**
- ✅ Payment token created successfully
- ✅ Layer.js modal opens
- ✅ Payment completes
- ✅ Redirects to success page
- ✅ Order details displayed
- ✅ Cart cleared

### Test 2: Payment Failure Flow

**Steps:**
1. **Repeat Steps 1-5 from Test 1**

2. **Cancel Payment**
   - Click cancel/close in Zwitch modal
   - OR let payment fail

3. **Verify Failure Page**
   - Should redirect to `/payment-failed`
   - Should show error message
   - Should display order ID (if available)
   - Should show possible reasons
   - Can click "Try Again" or "Back to Home"

**Expected Results:**
- ✅ Redirects to failed page
- ✅ Error message displayed
- ✅ Order ID shown (if order was created)
- ✅ Can retry payment

### Test 3: Payment Cancellation

**Steps:**
1. **Repeat Steps 1-5 from Test 1**

2. **Cancel Payment**
   - Click cancel button in Zwitch modal

3. **Verify Cancellation**
   - Should redirect to `/payment-failed`
   - Should show "Payment was cancelled" message

**Expected Results:**
- ✅ Redirects to failed page
- ✅ Cancellation message displayed

## 🔍 What to Check During Testing

### Browser Console
- ✅ No JavaScript errors
- ✅ "Zwitch Sandbox Layer.js SDK loaded" message
- ✅ "Creating payment order..." log
- ✅ Payment response logged correctly

### Network Tab
- ✅ `create-payment-order` Edge Function called successfully
- ✅ Response contains `paymentToken` and `accessKey`
- ✅ `sandbox-payments.open.money/layer` SDK loaded (not live)
- ✅ `verify-payment` Edge Function called after payment

### Edge Function Logs
1. **Go to Supabase Dashboard → Edge Functions → `create-payment-order` → Logs**
   - ✅ "Reading Zwitch credentials from Vault" - Should show credentials found
   - ✅ "Zwitch API Configuration" - Should show sandbox endpoint
   - ✅ "Zwitch API Success" - Should show payment token created
   - ✅ "Order created in database" - Should show order ID

2. **Go to Supabase Dashboard → Edge Functions → `verify-payment` → Logs**
   - ✅ "Reading Zwitch credentials from Vault" - Should show credentials found
   - ✅ "Zwitch Verification" - Should show sandbox endpoint
   - ✅ "Zwitch Verification Success" - Should show payment verified
   - ✅ Order updated in database

### Database Check
1. **Go to Supabase Dashboard → Table Editor → `orders`**
   - ✅ Order created with correct details
   - ✅ `payment_status` = "paid" (for success)
   - ✅ `status` = "confirmed" (for success)
   - ✅ `gateway_payment_id` populated
   - ✅ `gateway_order_id` populated

## 🐛 Common Issues & Solutions

### Issue 1: "Zwitch SDK not loaded"
**Solution:**
- Clear browser cache
- Hard refresh (Ctrl+Shift+R / Cmd+Shift+R)
- Check network tab for SDK loading errors

### Issue 2: "Invalid access key passed"
**Solution:**
- Verify credentials in Supabase Vault
- Check Edge Function logs for exact access key being used
- Ensure sandbox credentials are correct

### Issue 3: "User not found"
**Solution:**
- Verify Zwitch account is active
- Check if sandbox is enabled in Zwitch dashboard
- Contact Zwitch support if account looks fine

### Issue 4: Wrong SDK loaded (live instead of sandbox)
**Solution:**
- Clear browser cache
- Check `gateway-sdk-loader.ts` is using sandbox URL
- Verify Checkout.tsx loads sandbox SDK

### Issue 5: Order not created
**Solution:**
- Check Edge Function logs for database errors
- Verify database connection
- Check order table structure

## ✅ Final Verification Checklist

### Backend
- [ ] Credentials in Supabase Vault
- [ ] Edge Functions deployed
- [ ] Sandbox endpoint configured
- [ ] Error handling working

### Frontend
- [ ] Routes added to App.tsx
- [ ] Checkout page loads SDK correctly
- [ ] Success page displays order details
- [ ] Failed page displays error message
- [ ] Redirects working correctly

### Integration
- [ ] Payment token creation works
- [ ] Layer.js modal opens
- [ ] Payment completion works
- [ ] Verification works
- [ ] Order creation works
- [ ] Cart clearing works

## 🚀 Ready to Test!

Everything should be set up correctly. Follow the test flow above and check each step. If you encounter any issues, refer to the "Common Issues & Solutions" section.

**Start Testing:**
1. Add items to cart
2. Go to checkout
3. Fill details
4. Click "Pay Now"
5. Complete payment in Zwitch sandbox
6. Verify success page

Good luck! 🎉

