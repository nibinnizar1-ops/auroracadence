# Check Browser Console - Step by Step

## Step 1: Open Browser Console

1. Go to your website: `http://localhost:8080`
2. Press **F12** (or **Cmd+Option+I** on Mac)
3. Click the **Console** tab
4. Clear the console (click the 🚫 icon or press Ctrl+L)

## Step 2: Look for These Messages

### Good Signs (Product is Loading):
- `[getProducts] Found X products with valid variants out of Y total`
- No red error messages

### Bad Signs (Product Not Loading):
- `[Product ed55c4f7...] - No variants found`
- `[Product ed55c4f7...] - Invalid variant: available=false, price=0`
- `[Product ed55c4f7...] - No valid variants`
- Red error messages

## Step 3: Check Network Tab

1. Click the **Network** tab (next to Console)
2. Filter by "products" or "fetch"
3. Look for a request to: `rest/v1/products?select=...&status=eq.active`
4. Click on it
5. Check:
   - **Status**: Should be `200 OK` (not 400 or 500)
   - **Response**: Click "Response" tab - does it show your product?

## Step 4: Take Screenshot

Take a screenshot of:
1. Console tab (showing all messages)
2. Network tab (showing the products API call)

Share these with me so I can see exactly what's happening.

