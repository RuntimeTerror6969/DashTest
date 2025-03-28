## Getting Started
Static Website built using `NextJS` for [QuantTraderTools.vercel.app]( https://quanttradertools.vercel.app/ ) . The site build and rendering happens automatically using Vercel Deployment Actions<br>

## To Run this project locally
1. Install nextJS and other packages using `npm install`
2. Run the development server using `npm run dev`

### Steps to generate static site build for local testing
1. Run the static site build using `npm run build`
2. Render the static site locally using `npx serve ./out`

If you are making changes and want to start fresh with building a static site and remove any existing static site builds, execute the below steps:
```bash
rm -rf node_modules package-lock.json out .next
npm cache clean --force
npm install
npm run build
npx serve ./out -s --cors -l 3000
```

### Environment Variables

To run this project, you need to create a `.env.local` file in the root directory of the project. This file should contain the following fields and values:

```bash
# General
NODE_ENV=development
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Telegram
BUYER_ALERT_TGBOT_TOKEN=8163257754:AAHCEnMtU5a63cyxcSL4ufCdP6SD-Fhqt4Q
TELEGRAM_BUYERALERT_CHANNEL_ID=-1002423804631

# PhonePe API credentials (server-side)
PHONEPE_MERCHANT_ID="PGTESTPAYUAT86"
PHONEPE_SALT_KEY="96434309-7796-489d-8924-ab56988a6076"
PHONEPE_SALT_INDEX=1
PHONEPE_ENV="development" # Change to "production" for live environment

# Public variables (client-side)
NEXT_PUBLIC_MERCHANT_UPI_NAME="DILIP RAJKUMAR"
NEXT_PUBLIC_MERCHANT_VPA="dilip.rajkumar@airtel"

# Firebase Admin SDK credentials
FIREBASE_PROJECT_ID="<From your ServiceAccount.json>"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nM"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk@xyz.iam.gserviceaccount.com"
FIREBASE_CLIENT_ID="<From your ServiceAccount.json>"

# PayPal  Credentials
PAYPAL_ENV=sandbox
NEXT_PUBLIC_PAYPAL_CLIENT_ID="ASz2ftEDsVdIiI2bhZFNw7GJN0WcDYZilWgaMN_37uwx81WlzQX_ironnR22HkmMINRgVNhN0799EH-q"
PAYPAL_CLIENT_SECRET="EIGNIWMpqfsYVWgRTs1pKej0zYcM07XEUnljrcLLTQ9oSj-7HmDv28gYUY0LEE_cQsXDvnP9mh1FbhYj"
```

Make sure to replace the placeholder values with your actual credentials and configuration details. This is essential for the application to function correctly. When deploying to vercel, add these as environment variables with production values

## Environment Variables Required

For Firebase Admin SDK:
- FIREBASE_PROJECT_ID
- FIREBASE_PRIVATE_KEY_ID
- FIREBASE_PRIVATE_KEY
- FIREBASE_CLIENT_EMAIL
- FIREBASE_CLIENT_ID

The Firebase Admin SDK credentials can be obtained from Firebase Console > Project Settings > Service Accounts > Generate New Private Key