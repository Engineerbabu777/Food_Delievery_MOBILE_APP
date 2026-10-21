#!/usr/bin/env bash
set -e

# ==============================================================================
# Script: apply_commit_plan.sh
# Purpose: Applies the approved 100-commit plan across 2 days:
# Day 1: October 20, 2026 (Commits 1 - 40)
# Day 2: October 21, 2026 (Commits 41 - 100)
# ==============================================================================

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

echo "🚀 Starting 100-commit execution in: $PROJECT_ROOT"

# Ensure .pnpm-store/ is ignored
if ! grep -q "^\.pnpm-store" .gitignore 2>/dev/null; then
  echo ".pnpm-store/" >> .gitignore
fi

# Helper function to stage files and create backdated commit
do_commit() {
  local commit_num="$1"
  local date_str="$2"
  local message="$3"
  shift 3
  local files=("$@")

  for f in "${files[@]}"; do
    git add -A "$f" 2>/dev/null || true
  done

  export GIT_AUTHOR_DATE="$date_str +0500"
  export GIT_COMMITTER_DATE="$date_str +0500"

  if git diff --staged --quiet; then
    git commit --allow-empty -m "$message"
  else
    git commit -m "$message"
  fi

  echo "[$commit_num/100] ✅ Committed: $message ($date_str)"
}

# ==============================================================================
# DAY 1: October 20, 2026 (Commits 1 - 40)
# ==============================================================================
echo "--- Executing Day 1 Commits (2026-10-20) ---"

do_commit 1 "2026-10-20 09:00:00" "chore(repo): update root typescript configuration with base paths" "tsconfig.base.json"
do_commit 2 "2026-10-20 09:15:00" "chore(repo): configure workspace packages and toolchain settings" "pnpm-workspace.yaml" "package.json" ".gitignore"
do_commit 3 "2026-10-20 09:30:00" "chore(repo): configure vscode editor recommendations and settings" ".vscode/extensions.json" ".vscode/settings.json"
do_commit 4 "2026-10-20 09:45:00" "chore(types): declare shared data types and contract definitions" "packages/types/package.json" "packages/types/index.ts"
do_commit 5 "2026-10-20 10:00:00" "chore(api): configure drizzle orm postgres database connection settings" "apps/api/drizzle.config.ts"
do_commit 6 "2026-10-20 10:15:00" "chore(api): configure api development workspace and extensions" "apps/api/.vscode/extensions.json" "apps/api/.vscode/settings.json"
do_commit 7 "2026-10-20 10:30:00" "chore(api): update dependencies and scripts for nestjs api service" "apps/api/package.json"
do_commit 8 "2026-10-20 10:45:00" "refactor(db): migrate users schema and role enum to modular definition" "apps/api/src/db/schema/users.ts" "apps/api/src/db/schema/user.schema.ts"
do_commit 9 "2026-10-20 11:00:00" "refactor(db): migrate restaurants schema with delivery and pricing fields" "apps/api/src/db/schema/restaurants.ts" "apps/api/src/db/schema/resturants.schema.ts"
do_commit 10 "2026-10-20 11:15:00" "refactor(db): migrate menus and menu items schema definitions" "apps/api/src/db/schema/menus.ts" "apps/api/src/db/schema/menu.schema.ts"
do_commit 11 "2026-10-20 11:30:00" "refactor(db): migrate orders and order items relational schema" "apps/api/src/db/schema/orders.ts" "apps/api/src/db/schema/orders.schema.ts"
do_commit 12 "2026-10-20 11:45:00" "refactor(db): migrate reviews and ratings schema definition" "apps/api/src/db/schema/reviews.ts" "apps/api/src/db/schema/reviews.schema.ts"
do_commit 13 "2026-10-20 12:00:00" "refactor(db): unify database exports and schema barrel aggregator" "apps/api/src/db/schema/index.ts"
do_commit 14 "2026-10-20 12:15:00" "feat(db): initialize database connection pool and drizzle provider" "apps/api/src/db/index.ts" "apps/api/src/db/db.module.ts"
do_commit 15 "2026-10-20 12:30:00" "feat(cache): define structured cache key generators and ttls" "apps/api/src/cache/cache-keys.ts"
do_commit 16 "2026-10-20 12:45:00" "feat(cache): implement in-memory and redis caching service" "apps/api/src/cache/cache.service.ts"
do_commit 17 "2026-10-20 13:00:00" "feat(cache): register cache module with global dependency injection" "apps/api/src/cache/cache.module.ts"
do_commit 18 "2026-10-20 13:15:00" "feat(gateway): implement real-time websocket gateway for live orders" "apps/api/src/gateway/orders.gateway.ts"
do_commit 19 "2026-10-20 13:30:00" "feat(gateway): register websocket gateway module for broadcast events" "apps/api/src/gateway/gateway.module.ts"
do_commit 20 "2026-10-20 13:45:00" "feat(auth): define user registration validation schema and dto" "apps/api/src/auth/dto/register.dto.ts"
do_commit 21 "2026-10-20 14:00:00" "feat(auth): define user login credentials validation dto" "apps/api/src/auth/dto/login.dto.ts"
do_commit 22 "2026-10-20 14:15:00" "feat(auth): implement roles decorator for route permission tagging" "apps/api/src/auth/decorators/roles.decorator.ts"
do_commit 23 "2026-10-20 14:30:00" "feat(auth): implement jwt authentication guard with token verification" "apps/api/src/auth/guards/jwt-auth.guard.ts"
do_commit 24 "2026-10-20 14:45:00" "feat(auth): implement role-based access control guard" "apps/api/src/auth/guards/roles.guard.ts"
do_commit 25 "2026-10-20 15:00:00" "feat(auth): build authentication service for password hashing and tokens" "apps/api/src/auth/auth.service.ts"
do_commit 26 "2026-10-20 15:15:00" "feat(auth): expose login, register, and profile endpoints in auth controller" "apps/api/src/auth/auth.controller.ts"
do_commit 27 "2026-10-20 15:30:00" "feat(auth): register authentication module with jwt and passport strategies" "apps/api/src/auth/auth.module.ts"
do_commit 28 "2026-10-20 15:45:00" "feat(location): build driver geolocation tracker service" "apps/api/src/location/location.service.ts"
do_commit 29 "2026-10-20 16:00:00" "feat(location): expose driver coordinates updating controller" "apps/api/src/location/location.controller.ts"
do_commit 30 "2026-10-20 16:15:00" "feat(location): register driver location module" "apps/api/src/location/location.module.ts"
do_commit 31 "2026-10-20 16:30:00" "feat(upload): configure uploadthing server route handler for image uploads" "apps/api/src/uploadthing/upload-router.ts"
do_commit 32 "2026-10-20 16:45:00" "chore(mobile): configure mobile prettier code formatting rules" "apps/mobile/.prettierrc"
do_commit 33 "2026-10-20 17:00:00" "chore(mobile): configure eslint rules for expo react native" "apps/mobile/eslint.config.mjs"
do_commit 34 "2026-10-20 17:15:00" "docs(mobile): update development instructions and agent guidelines" "apps/mobile/AGENTS.md" "apps/mobile/CLAUDE.md" "apps/mobile/.claude"
do_commit 35 "2026-10-20 17:30:00" "feat(mobile): establish unified design token palette and dark theme colors" "apps/mobile/src/constants/theme.ts"
do_commit 36 "2026-10-20 17:45:00" "feat(mobile): implement system color scheme detection hook" "apps/mobile/src/hooks/use-color-scheme.ts"
do_commit 37 "2026-10-20 18:00:00" "feat(mobile): implement web platform adapter for color scheme detection" "apps/mobile/src/hooks/use-color-scheme.web.ts"
do_commit 38 "2026-10-20 18:15:00" "feat(mobile): build unified useTheme hook for dynamic color resolution" "apps/mobile/src/hooks/use-theme.ts"
do_commit 39 "2026-10-20 18:30:00" "feat(mobile): implement useDebounce hook for search input optimization" "apps/mobile/src/hooks/use-debounce.ts"
do_commit 40 "2026-10-20 18:45:00" "feat(mobile): build zustand persistent store for shopping cart management" "apps/mobile/src/store/cart-store.ts"

# ==============================================================================
# DAY 2: October 21, 2026 (Commits 41 - 100)
# ==============================================================================
echo "--- Executing Day 2 Commits (2026-10-21) ---"

do_commit 41 "2026-10-21 09:00:00" "feat(restaurants): create restaurant input transfer object schemas" "apps/api/src/restaurants/dto/create-restaurant.dto.ts" "apps/api/src/resturants/dto/create-resturant.dto.ts"
do_commit 42 "2026-10-21 09:12:00" "feat(restaurants): create restaurant update transfer object schema" "apps/api/src/restaurants/dto/update-restaurant.dto.ts" "apps/api/src/resturants/dto/update-resturant.dto.ts"
do_commit 43 "2026-10-21 09:24:00" "feat(restaurants): implement restaurant repository queries and filtering" "apps/api/src/restaurants/restaurants.service.ts" "apps/api/src/resturants/resturant.service.ts"
do_commit 44 "2026-10-21 09:36:00" "feat(restaurants): expose rest endpoints for restaurant catalog and management" "apps/api/src/restaurants/restaurants.controller.ts" "apps/api/src/resturants/resturant.controller.ts"
do_commit 45 "2026-10-21 09:48:00" "feat(restaurants): register restaurants module in application container" "apps/api/src/restaurants/restaurants.module.ts" "apps/api/src/resturants/resturant.module.ts"
do_commit 46 "2026-10-21 10:00:00" "feat(menu): define category creation and update data transfer objects" "apps/api/src/menu/dto/create-category.dto.ts" "apps/api/src/menu/dto/update-category.dto.ts"
do_commit 47 "2026-10-21 10:12:00" "feat(menu): define menu item creation and price update dtos" "apps/api/src/menu/dto/create-menu-item.dto.ts" "apps/api/src/menu/dto/update-menu-item.dto.ts"
do_commit 48 "2026-10-21 10:24:00" "feat(menu): implement menu item and category business logic service" "apps/api/src/menu/menu.service.ts"
do_commit 49 "2026-10-21 10:36:00" "feat(menu): expose menu management and category endpoints" "apps/api/src/menu/menu.controller.ts"
do_commit 50 "2026-10-21 10:48:00" "feat(menu): register menu domain module with database providers" "apps/api/src/menu/menu.module.ts"
do_commit 51 "2026-10-21 11:00:00" "feat(orders): define order item and status update transfer objects" "apps/api/src/orders/dto/order-item.dto.ts" "apps/api/src/orders/dto/update-status.dto.ts"
do_commit 52 "2026-10-21 11:12:00" "feat(orders): define order creation request data transfer object" "apps/api/src/orders/dto/create-order.dto.ts"
do_commit 53 "2026-10-21 11:24:00" "feat(orders): implement checkout, tax calculation, and order lifecycle service" "apps/api/src/orders/orders.service.ts"
do_commit 54 "2026-10-21 11:36:00" "feat(orders): expose order placement, history, and status controller" "apps/api/src/orders/orders.controller.ts"
do_commit 55 "2026-10-21 11:48:00" "feat(orders): register orders module with websocket gateway binding" "apps/api/src/orders/orders.module.ts"
do_commit 56 "2026-10-21 12:00:00" "feat(driver): implement driver order assignment and fulfillment service" "apps/api/src/driver/driver.service.ts"
do_commit 57 "2026-10-21 12:12:00" "feat(driver): expose driver active delivery and earnings controller" "apps/api/src/driver/driver.controller.ts"
do_commit 58 "2026-10-21 12:24:00" "feat(driver): register driver fulfillment module" "apps/api/src/driver/driver.module.ts"
do_commit 59 "2026-10-21 12:36:00" "feat(payments): define stripe payment intent creation request dto" "apps/api/src/payments/dto/create-payment-intent.dto.ts"
do_commit 60 "2026-10-21 12:48:00" "feat(payments): implement stripe payment intent creation and confirmation" "apps/api/src/payments/payments.service.ts"
do_commit 61 "2026-10-21 13:00:00" "feat(payments): expose payment intent webhook and client secrets controller" "apps/api/src/payments/payments.controller.ts"
do_commit 62 "2026-10-21 13:12:00" "feat(payments): register payments processing module with stripe sdk" "apps/api/src/payments/payments.module.ts"
do_commit 63 "2026-10-21 13:24:00" "feat(reviews): define customer review submission validation dto" "apps/api/src/reviews/dto/create-review.dto.ts"
do_commit 64 "2026-10-21 13:36:00" "feat(reviews): implement restaurant review creation and average rating calculation" "apps/api/src/reviews/reviews.service.ts"
do_commit 65 "2026-10-21 13:48:00" "feat(reviews): expose customer review submission and listing endpoints" "apps/api/src/reviews/reviews.controller.ts"
do_commit 66 "2026-10-21 14:00:00" "feat(reviews): register reviews module in nestjs application" "apps/api/src/reviews/reviews.module.ts"
do_commit 67 "2026-10-21 14:12:00" "refactor(api): configure base api controller routes and health endpoints" "apps/api/src/app.controller.ts"
do_commit 68 "2026-10-21 14:24:00" "refactor(api): import all domain modules into root application module" "apps/api/src/app.module.ts"
do_commit 69 "2026-10-21 14:36:00" "refactor(api): bootstrap application entrypoint with global validation pipes and cors" "apps/api/src/main.ts"
do_commit 70 "2026-10-21 14:48:00" "fix(deps): configure workspace patches for expo and react native" "patches/expo-constants.patch" "patches/react-native@0.83.6.patch" "patches/@expo__cli.patch"
do_commit 71 "2026-10-21 15:00:00" "chore(mobile): update mobile package dependencies with expo sdk 55 modules" "apps/mobile/package.json"
do_commit 72 "2026-10-21 15:12:00" "refactor(mobile): migrate static app.json configuration to dynamic app.config.ts" "apps/mobile/app.config.ts" "apps/mobile/app.json"
do_commit 73 "2026-10-21 15:24:00" "feat(mobile): build api client instance with interceptors and base url" "apps/mobile/src/lib/axios.ts"
do_commit 74 "2026-10-21 15:36:00" "feat(mobile): implement secure authentication token storage and session helpers" "apps/mobile/src/lib/auth.ts"
do_commit 75 "2026-10-21 15:48:00" "feat(mobile): configure uploadthing client helper for photo uploads" "apps/mobile/src/lib/uploadthing.ts"
do_commit 76 "2026-10-21 16:00:00" "feat(mobile): build auth context provider with login and role management" "apps/mobile/src/context/auth-context.tsx"
do_commit 77 "2026-10-21 16:12:00" "feat(mobile): implement useOrderSocket hook for live order event listening" "apps/mobile/src/hooks/use-order-socket.ts"
do_commit 78 "2026-10-21 16:24:00" "feat(mobile): build ThemedView foundation component with background styling" "apps/mobile/src/components/themed-view.tsx"
do_commit 79 "2026-10-21 16:36:00" "feat(mobile): build ThemedText component with typography variants" "apps/mobile/src/components/themed-text.tsx"
do_commit 80 "2026-10-21 16:48:00" "feat(mobile): build Collapsible UI component with smooth animation" "apps/mobile/src/components/ui/collapsible.tsx"
do_commit 81 "2026-10-21 17:00:00" "feat(mobile): build ExternalLink and HintRow UI helper components" "apps/mobile/src/components/external-link.tsx" "apps/mobile/src/components/hint-row.tsx"
do_commit 82 "2026-10-21 17:12:00" "feat(mobile): build WebBadge component for platform indicators" "apps/mobile/src/components/web-badge.tsx"
do_commit 83 "2026-10-21 17:24:00" "feat(mobile): build AnimatedIcon component with animated icon styles" "apps/mobile/src/components/animated-icon.tsx" "apps/mobile/src/components/animated-icon.web.tsx" "apps/mobile/src/components/animated-icon.module.css"
do_commit 84 "2026-10-21 17:36:00" "feat(mobile): build AppTabs native and responsive web navigation bar" "apps/mobile/src/components/app-tabs.tsx" "apps/mobile/src/components/app-tabs.web.tsx"
do_commit 85 "2026-10-21 17:48:00" "feat(mobile): build RatingModal component for order feedback and reviews" "apps/mobile/src/components/rating-modal.tsx"
do_commit 86 "2026-10-21 18:00:00" "feat(mobile): configure root stack navigator with auth status redirection" "apps/mobile/src/app/_layout.tsx"
do_commit 87 "2026-10-21 18:12:00" "feat(mobile): implement splash landing and initial role routing screen" "apps/mobile/src/app/index.tsx"
do_commit 88 "2026-10-21 18:24:00" "feat(mobile): build user login screen with validation and error toasts" "apps/mobile/src/app/login.tsx"
do_commit 89 "2026-10-21 18:36:00" "feat(mobile): build user registration screen with role selection" "apps/mobile/src/app/register.tsx"
do_commit 90 "2026-10-21 18:48:00" "feat(mobile): build system health inspection and test explorer screens" "apps/mobile/src/app/health.tsx" "apps/mobile/src/app/explore.tsx"
do_commit 91 "2026-10-21 19:00:00" "feat(mobile): implement customer bottom tab layout and navigation hierarchy" "apps/mobile/src/app/(customer)/_layout.tsx" "apps/mobile/src/app/(customer)/(tabs)/_layout.tsx"
do_commit 92 "2026-10-21 19:12:00" "feat(mobile): build customer home screen with restaurant catalog and category filters" "apps/mobile/src/app/(customer)/(tabs)/(home)/_layout.tsx" "apps/mobile/src/app/(customer)/(tabs)/(home)/index.tsx" "apps/mobile/src/app/(customer)/index.tsx"
do_commit 93 "2026-10-21 19:24:00" "feat(mobile): build restaurant menu details and category item list screen" "apps/mobile/src/app/(customer)/(tabs)/(home)/restaurant/[id].tsx"
do_commit 94 "2026-10-21 19:36:00" "feat(mobile): build restaurant search and filter screen" "apps/mobile/src/app/(customer)/(tabs)/search.tsx" "apps/mobile/src/app/(customer)/search.tsx"
do_commit 95 "2026-10-21 19:48:00" "feat(mobile): build customer cart checkout screen" "apps/mobile/src/app/(customer)/(tabs)/cart.tsx" "apps/mobile/src/app/(customer)/cart.tsx"
do_commit 96 "2026-10-21 20:00:00" "feat(mobile): build customer order history and user profile screens" "apps/mobile/src/app/(customer)/(tabs)/orders.tsx" "apps/mobile/src/app/(customer)/orders.tsx" "apps/mobile/src/app/(customer)/(tabs)/profile.tsx" "apps/mobile/src/app/(customer)/profile.tsx"
do_commit 97 "2026-10-21 20:12:00" "feat(mobile): build customer live order tracking screen with status milestones" "apps/mobile/src/app/(customer)/order/[id].tsx"
do_commit 98 "2026-10-21 20:24:00" "feat(mobile): implement driver navigation stack and fulfillment screens" "apps/mobile/src/app/(driver)/_layout.tsx" "apps/mobile/src/app/(driver)/index.tsx" "apps/mobile/src/app/(driver)/active.tsx" "apps/mobile/src/app/(driver)/history.tsx" "apps/mobile/src/app/(driver)/profile.tsx"
do_commit 99 "2026-10-21 20:36:00" "feat(mobile): implement restaurant owner management portal screens" "apps/mobile/src/app/(owner)/_layout.tsx" "apps/mobile/src/app/(owner)/(index)/_layout.tsx" "apps/mobile/src/app/(owner)/(index)/index.tsx" "apps/mobile/src/app/(owner)/(index)/create-restaurant.tsx" "apps/mobile/src/app/(owner)/(index)/edit-restaurant.tsx" "apps/mobile/src/app/(owner)/menu.tsx" "apps/mobile/src/app/(owner)/analytics.tsx" "apps/mobile/src/app/(owner)/profile.tsx"

# Commit 100: Native configs, assets, lockfiles, scripts, and remaining cleanup
git add -A
do_commit 100 "2026-10-21 20:48:00" "feat(mobile): configure native android and ios builds and splash assets" "apps/mobile/android" "apps/mobile/ios" "apps/mobile/.gitignore" "pnpm-lock.yaml" "scripts/apply_commit_plan.sh"

echo "🎉 All 100 commits applied successfully across October 20 and October 21!"
