# Cleanup: Duplicate Admin Files

## Issue
Some admin pages exist in both locations:
- `src/pages/admin/` (old location)
- `src/pages/admin/media/` (new organized location)

## Files to Delete (Old Location)

These files are duplicates and should be deleted since routes point to the `media/` folder:

1. `src/pages/admin/Banners.tsx` → Use `src/pages/admin/media/Banners.tsx`
2. `src/pages/admin/BannerForm.tsx` → Use `src/pages/admin/media/BannerForm.tsx`
3. `src/pages/admin/CategoryShowcase.tsx` → Use `src/pages/admin/media/CategoryShowcase.tsx`
4. `src/pages/admin/CategoryShowcaseForm.tsx` → Use `src/pages/admin/media/CategoryShowcaseForm.tsx`
5. `src/pages/admin/LuxuryMoods.tsx` → Use `src/pages/admin/media/LuxuryMoods.tsx`
6. `src/pages/admin/LuxuryMoodsForm.tsx` → Use `src/pages/admin/media/LuxuryMoodsForm.tsx`
7. `src/pages/admin/GiftGuide.tsx` → Use `src/pages/admin/media/GiftGuide.tsx`
8. `src/pages/admin/GiftGuideForm.tsx` → Use `src/pages/admin/media/GiftGuideForm.tsx`
9. `src/pages/admin/InfluencerForm.tsx` → Use `src/pages/admin/media/InfluencerForm.tsx`
10. `src/pages/admin/StoreForm.tsx` → Use `src/pages/admin/media/StoreForm.tsx`

## Verification
All routes in `src/App.tsx` point to the `media/` folder, so deleting these won't break anything.

## Action
Delete these files to clean up the codebase.

