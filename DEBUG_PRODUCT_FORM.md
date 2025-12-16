# Debug Product Form Blank Page

## Issue
Product creation page (`/admin/products/new`) shows blank page.

## Possible Causes

1. **JavaScript Error** - Check browser console (F12) for errors
2. **Admin Authentication** - Verify you're logged in as admin
3. **Route Issue** - Check if route is properly configured
4. **Component Error** - Component might be throwing an error

## Steps to Debug

### 1. Check Browser Console
- Open DevTools (F12)
- Go to Console tab
- Look for red error messages
- Share any errors you see

### 2. Check Network Tab
- Open DevTools (F12)
- Go to Network tab
- Refresh the page
- Look for failed requests (red)
- Check if API calls are failing

### 3. Check React DevTools
- Install React DevTools extension
- Check if ProductForm component is rendering
- Check component state

### 4. Verify Admin Access
- Make sure you're logged in
- Verify your user is in `admin_users` table
- Try accessing `/admin` dashboard first

### 5. Check Route Configuration
- Verify route exists in `App.tsx`
- Check if route path matches: `/admin/products/new`

## Quick Fixes Applied

1. ✅ Added better error handling in `loadDropdowns()`
2. ✅ Made coupon loading non-blocking
3. ✅ Added try-catch around initialization

## Manual Test

Try this in browser console:
```javascript
// Check if you're logged in
console.log('User:', window.localStorage.getItem('auth'));

// Check if admin
// (You'll need to check your auth store)
```

## Next Steps

1. **Check Console** - Share any errors from browser console
2. **Check Network** - Share any failed API requests
3. **Verify Route** - Confirm route exists in App.tsx
4. **Test Admin Access** - Try accessing other admin pages

## If Still Blank

The component should always render something. If it's completely blank:
- There might be a syntax error
- There might be a missing import
- The route might not be configured

Please share:
1. Browser console errors
2. Network tab errors
3. Whether other admin pages work

