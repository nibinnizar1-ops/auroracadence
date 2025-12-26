# Zwitch API Endpoint Fix

## Issue

The Zwitch API is returning **404 Not Found** for the endpoint:
```
https://api.zwitch.io/v1/payment_token
```

## What I Need

The Layer.js documentation you shared (https://developers.zwitch.io/reference/layerjs) shows how to use the frontend SDK, but **doesn't show the actual API endpoint URL** for creating payment tokens.

## Next Steps

1. **Find the Zwitch API Documentation**:
   - Go to: https://developers.zwitch.io/reference/
   - Navigate to **"Layer (Payment Gateway)"** section
   - Find **"Create Payment Token"** API
   - Copy the **exact endpoint URL** (it might be different from `/v1/payment_token`)

2. **Or Check Your Zwitch Dashboard**:
   - Log in to your Zwitch account
   - Go to API settings or documentation
   - Find the correct endpoint for creating payment tokens

3. **Possible Endpoint Variations** (if documentation is not available):
   - `https://api.zwitch.io/v1/payment_tokens` (plural)
   - `https://api.zwitch.io/v2/payment_token` (v2)
   - `https://api.zwitch.io/payment_token` (no version)
   - Or a different base URL entirely

## What I've Done

I've added better logging to show exactly what endpoint is being called. After you find the correct endpoint:

1. **Update the endpoint** in the code
2. **Or configure it** in the admin panel:
   - Go to Admin → Payments → Gateways
   - Edit Zwitch gateway
   - In the config, add: `api_base_url` with the correct base URL

## Quick Fix Option

If you have access to your Zwitch dashboard, you can also:
1. Check if there's an API endpoint configuration
2. Or contact Zwitch support for the correct endpoint URL

Once you share the correct endpoint, I'll update the code immediately!

