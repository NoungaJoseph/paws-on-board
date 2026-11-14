# Paws on Board â€” Complete source code

Next.js, React, TypeScript and Tailwind CSS storefront.

## Run locally

Install Node.js 22 LTS or newer. Extract this ZIP, open the paws-on-board folder in VS Code, then run in its terminal:

```bash
npm ci
npm run dev
```

Open http://localhost:3000 in your browser.

## Build for hosting

```bash
npm run build
```

This project now uses a Next.js server for order requests. Deploy it to a Node.js host such as Vercel; a static-only host cannot run the order email endpoint. Use `npm run build` to build and `npm start` to run the production server.

For order email, copy `.env.example` to `.env.local` and set `RESEND_API_KEY`, `ORDERS_TO_EMAIL`, and `ORDERS_FROM_EMAIL` to private values from your email provider. The sender address must be authorized by that provider. Never commit `.env.local` or expose the API key in browser code.

## Main files

- app/store.tsx: storefront, product details, reviews, shopping bag and checkout.
- app/api/orders/route.ts: validates order requests and emails them to the shop.
- app/catalog.json: 32 individual products and 13 bundles, AUD base prices and components.
- app/currency.ts and app/rates.json: AUD/USD/CAD conversion and dated fallback rates.
- app/motion.tsx: holiday carousel, background video and motion preferences.
- app/globals.css: styling and responsive layouts.
- app/shop, app/car-travel, app/bundles: collection routes.
- app/products/[slug]: generated product routes.
- public/images and public/videos: all locally used visual assets.

Order email requires the private environment variables above. Currency updates use Frankfurter; a saved dated rate snapshot is used if the request fails. The shopping bag and country selection are saved in the visitor's browser.

## Current scope

Checkout sends an unpaid order request to the shop by email. The shop then confirms delivery and privately emails payment instructions for the customer's selected method. Card or wallet payments are not processed automatically, and shipping prices, tax, inventory and fulfilment integrations are not configured. Prices, including the three holiday bundles, are proposed. Review counts and review stories are clearly labeled illustrative examples and should be replaced with verified customer feedback.


The archive contains the complete tracked project and assets from commit d116756e2c6fdd7cc4ce89e475a72c11663a60e4, plus this guide. Dependencies (node_modules), generated build output, caches and Git history are excluded; npm ci installs the locked dependencies.
# paws-on-board
