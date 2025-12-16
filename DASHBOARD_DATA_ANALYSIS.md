# Admin Dashboard - Data Analysis & Proposal

## 📊 Available Database Tables & Data

### 1. **products** Table
**Available Data:**
- `id`, `title`, `status` (active/draft/archived)
- `featured` (boolean)
- `created_at`, `updated_at`
- `category` (text)

**What We Can Calculate:**
- ✅ Total products count
- ✅ Active products count
- ✅ Draft products count
- ✅ Archived products count
- ✅ Featured products count
- ✅ Products by category
- ✅ Products created today/this week/this month

---

### 2. **orders** Table
**Available Data:**
- `id`, `order_number`
- `total` (DECIMAL) - Order total amount
- `subtotal` (DECIMAL)
- `discount_amount` (DECIMAL) - Discount applied
- `tax`, `shipping` (DECIMAL)
- `status` (pending, processing, shipped, delivered, cancelled)
- `payment_status` (pending, paid, failed, refunded)
- `created_at`, `updated_at`
- `coupon_id` (if coupon was used)

**What We Can Calculate:**
- ✅ Total orders count
- ✅ Orders by status (pending, processing, shipped, delivered, cancelled)
- ✅ Orders by payment status (pending, paid, failed, refunded)
- ✅ **Total revenue** (sum of `total` where `payment_status='paid'`)
- ✅ **Revenue today/this week/this month** (filter by `created_at`)
- ✅ **Total discount given** (sum of `discount_amount`)
- ✅ **Average order value** (avg of `total`)
- ✅ Orders with coupons (count where `coupon_id IS NOT NULL`)

---

### 3. **return_requests** Table
**Available Data:**
- `id`, `return_number`
- `status` (pending, approved, qc_pending, refunded, etc.)
- `refund_amount` (DECIMAL)
- `requested_at`, `created_at`

**What We Can Calculate:**
- ✅ Total return requests count
- ✅ Returns by status (pending, approved, qc_pending, refunded, etc.)
- ✅ **Total refund amount** (sum of `refund_amount` where `status='refunded'`)
- ✅ Returns requested today/this week/this month

---

### 4. **coupons** Table
**Available Data:**
- `id`, `code`, `name`
- `is_active` (boolean)
- `is_paused` (boolean)
- `discount_type` (percentage/fixed_amount)
- `discount_value` (DECIMAL)
- `created_at`

**What We Can Calculate:**
- ✅ Total coupons count
- ✅ Active coupons count
- ✅ Paused coupons count
- ✅ Inactive coupons count

---

### 5. **coupon_usage** Table
**Available Data:**
- `id`, `coupon_id`, `order_id`
- `discount_amount` (DECIMAL) - Discount applied
- `order_total_before_discount` (DECIMAL)
- `order_total_after_discount` (DECIMAL)
- `used_at` (TIMESTAMP)

**What We Can Calculate:**
- ✅ Total coupon uses count
- ✅ **Total discount given via coupons** (sum of `discount_amount`)
- ✅ Most used coupons
- ✅ Coupon usage today/this week/this month

---

### 6. **product_variants** Table
**Available Data:**
- `inventory_quantity` (INTEGER)
- `available` (boolean)
- `price` (DECIMAL)

**What We Can Calculate:**
- ✅ **Low stock products** (variants where `inventory_quantity < threshold`)
- ✅ **Out of stock products** (variants where `inventory_quantity = 0` AND `inventory_policy='deny'`)
- ✅ Total inventory value (sum of `price * inventory_quantity`)

---

### 7. **cart_items** & **wishlist_items** Tables
**Available Data:**
- `user_id`, `created_at`

**What We Can Calculate:**
- ✅ Total items in carts
- ✅ Total items in wishlists
- ✅ Active carts (users with items in cart)

---

## 🎯 Proposed Dashboard Metrics

### **Section 1: Overview Stats (4 Main Cards)**

1. **Total Revenue**
   - **Source**: `orders.total` WHERE `payment_status='paid'`
   - **Periods**: Today, This Week, This Month, All Time
   - **Format**: ₹X,XXX.XX

2. **Total Orders**
   - **Source**: `orders` table COUNT
   - **Breakdown**: Pending, Processing, Delivered
   - **Periods**: Today, This Week, This Month

3. **Total Products**
   - **Source**: `products` table COUNT
   - **Breakdown**: Active, Draft, Archived
   - **Quick View**: Active products count

4. **Pending Returns**
   - **Source**: `return_requests` WHERE `status='pending'`
   - **Action**: Link to returns page

---

### **Section 2: Financial Summary**

5. **Revenue Breakdown**
   - Total Revenue (paid orders)
   - Discount Given (from `orders.discount_amount` OR `coupon_usage.discount_amount`)
   - Net Revenue (Revenue - Discounts)
   - Refunds (from `return_requests.refund_amount` WHERE `status='refunded'`)

6. **Revenue Chart** (Optional - if we add charting library)
   - Revenue by day/week/month
   - Based on `orders.created_at` and `orders.total`

---

### **Section 3: Order Status Overview**

7. **Orders by Status**
   - Pending: COUNT WHERE `status='pending'`
   - Processing: COUNT WHERE `status='processing'`
   - Shipped: COUNT WHERE `status='shipped'`
   - Delivered: COUNT WHERE `status='delivered'`
   - Cancelled: COUNT WHERE `status='cancelled'`

8. **Payment Status**
   - Paid: COUNT WHERE `payment_status='paid'`
   - Pending: COUNT WHERE `payment_status='pending'`
   - Failed: COUNT WHERE `payment_status='failed'`

---

### **Section 4: Product Overview**

9. **Products by Status**
   - Active: COUNT WHERE `status='active'`
   - Draft: COUNT WHERE `status='draft'`
   - Archived: COUNT WHERE `status='archived'`

10. **Low Stock Alert** (if we want)
    - Products with `inventory_quantity < 10` (or threshold)
    - From `product_variants` table

---

### **Section 5: Recent Activity** (Optional)

11. **Recent Orders** (Last 5-10)
    - Order number, Customer name, Total, Status
    - From `orders` ORDER BY `created_at DESC`

12. **Recent Returns** (Last 5-10)
    - Return number, Order number, Status
    - From `return_requests` ORDER BY `created_at DESC`

---

### **Section 6: Coupon Performance**

13. **Coupon Stats**
    - Active coupons: COUNT WHERE `is_active=true`
    - Total uses: COUNT from `coupon_usage`
    - Total discount given: SUM from `coupon_usage.discount_amount`

---

## ❌ What We CANNOT Show (No Data Available)

- **Unique Customers** - We don't have a customers table, but we can count unique emails from orders
- **Customer Lifetime Value** - No customer tracking
- **Product Performance** - We don't track product views or sales per product (yet)
- **Conversion Rate** - No cart abandonment tracking
- **Traffic/Visits** - No analytics integration
- **Return Rate %** - Can calculate: (returns / orders) * 100

---

## 📋 Recommended Dashboard Layout

### **Top Row: 4 Main Stats Cards**
```
┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│   Revenue   │ │   Orders    │ │  Products   │ │   Returns   │
│  ₹XX,XXX    │ │     XX      │ │     XX      │ │   Pending   │
│  (This Mo)  │ │  (Pending)  │ │  (Active)   │ │     X       │
└─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘
```

### **Second Row: Financial Breakdown**
```
┌─────────────────────────────────────────┐
│  Financial Summary                      │
│  Total Revenue: ₹XX,XXX                 │
│  Discount Given: ₹X,XXX                  │
│  Net Revenue: ₹XX,XXX                   │
│  Refunds: ₹X,XXX                        │
└─────────────────────────────────────────┘
```

### **Third Row: Status Overviews**
```
┌──────────────────┐ ┌──────────────────┐
│  Orders Status   │ │  Products Status │
│  Pending: X      │ │  Active: X       │
│  Processing: X    │ │  Draft: X         │
│  Delivered: X    │ │  Archived: X     │
└──────────────────┘ └──────────────────┘
```

### **Fourth Row: Recent Activity**
```
┌─────────────────────────────────────────┐
│  Recent Orders                          │
│  • ORD-000001 - ₹4,999 - Pending        │
│  • ORD-000002 - ₹2,499 - Processing     │
│  ...                                     │
└─────────────────────────────────────────┘
```

---

## 🎯 Final Recommendation

### **Must Have (Based on Available Data):**
1. ✅ **Total Revenue** (from paid orders)
2. ✅ **Total Orders** (with status breakdown)
3. ✅ **Total Products** (with status breakdown)
4. ✅ **Pending Returns** (actionable)
5. ✅ **Financial Summary** (Revenue, Discounts, Refunds)
6. ✅ **Recent Orders** (last 5-10)

### **Nice to Have:**
7. ⭐ **Low Stock Alerts** (from variants)
8. ⭐ **Coupon Performance** (usage stats)
9. ⭐ **Order Status Breakdown** (visual)
10. ⭐ **Recent Returns** (last 5)

### **Skip (No Data):**
- ❌ Customer count (can use unique emails from orders)
- ❌ Conversion rate
- ❌ Traffic/visits
- ❌ Product performance rankings

---

## 💡 Questions for You:

1. **Do you want Low Stock alerts?** (We have inventory data)
2. **Do you want Revenue charts?** (Would need a charting library)
3. **Do you want Recent Activity section?** (Recent orders/returns)
4. **What time periods?** (Today, This Week, This Month, All Time)
5. **Any specific metrics you want to prioritize?**

**Let me know your preferences and I'll build the dashboard accordingly!** 🎯



