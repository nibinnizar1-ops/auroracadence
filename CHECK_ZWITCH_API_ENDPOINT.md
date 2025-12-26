# Check Zwitch API Endpoint

Based on the Zwitch documentation you shared (https://developers.zwitch.io/reference/layerjs), I need to find the correct API endpoint for creating payment tokens.

## Current Issue

The logs show:
```
ERROR: status: 404, requestUrl: "https://api.zwitch.io/v1/payment_token"
```

## What the Documentation Says

The documentation mentions:
- "A payment_token can be created by referring to create payment token API"
- This API should be called from server side
- But the exact endpoint URL is not shown in the Layer.js page

## Next Steps

1. **Check Zwitch API Documentation** for the exact endpoint:
   - Go to: https://developers.zwitch.io/reference/
   - Look for "Create Payment Token" API under "Layer (Payment Gateway)" section
   - Find the exact endpoint URL (might be different from `/v1/payment_token`)

2. **Possible Endpoint Variations**:
   - `https://api.zwitch.io/v1/payment_token` (current - getting 404)
   - `https://api.zwitch.io/v1/payment_tokens` (plural)
   - `https://api.zwitch.io/v2/payment_token` (different version)
   - `https://api.zwitch.io/payment_token` (no version)
   - Or a completely different base URL

3. **Check Your Zwitch Dashboard**:
   - Log in to your Zwitch dashboard
   - Check API documentation or settings
   - Look for the correct API endpoint URL

## What I Need From You

Please share:
1. The **exact API endpoint URL** from Zwitch documentation for "Create Payment Token"
2. Or check your Zwitch dashboard for the API endpoint
3. The API documentation page URL if you can find it

Once I have the correct endpoint, I'll update the code immediately!

