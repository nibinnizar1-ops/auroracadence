# Check Browser Network Tab - Step by Step

## Step 1: Open Network Tab

1. Go to: `http://localhost:8080`
2. Press **F12** (DevTools)
3. Click **Network** tab (next to Console)
4. **Clear** the network log (click 🚫 icon)

## Step 2: Reload Page

1. Press **Ctrl+Shift+R** (or **Cmd+Shift+R** on Mac) to hard refresh
2. Watch the Network tab fill up with requests

## Step 3: Find Products API Call

1. In the Network tab, look for a request that contains:
   - `products` in the URL
   - Or `rest/v1/products` in the URL
2. Click on that request

## Step 4: Check Request Details

### Check Request URL:
Should look like:
```
rest/v1/products?select=id,title,description,handle,...&status=eq.active&order=created_at.desc&offset=0&limit=20
```

### Check Response:
1. Click **Response** tab
2. Look for your product ID: `ed55c4f7-551b-4061-bfdf-be25978497c9`
3. Is it in the list?

### Check Status:
- Should be **200 OK** (green)
- If it's **400** or **500** (red), that's the problem!

## Step 5: Check Console Tab

1. Click **Console** tab
2. Look for:
   - `[getProducts] Found X products with valid variants out of Y total`
   - Any warnings about your product ID
   - Any red error messages

## Step 6: Take Screenshots

Take screenshots of:
1. **Network tab** - showing the products API request
2. **Response tab** - showing the JSON response
3. **Console tab** - showing all messages

Share these so I can see exactly what's happening!

