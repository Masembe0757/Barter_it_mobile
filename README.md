# BarterHub Mobile App

A fully functional React Native mobile app for the BarterHub platform - enabling users to trade assets and build community across African markets.

## Features

### ✅ Core Functionality
- **Authentication System**: Complete sign-in/sign-up with email verification
- **Asset Browsing**: Search and filter assets by category, location, and price
- **Asset Listing**: Create new asset listings with photos and details
- **User Dashboard**: Manage your assets and view trade history
- **Profile Management**: Update user information and preferences

### ✅ Payment Integration
- **Stripe Integration**: Secure credit/debit card payments
- **Mobile Money Support**: MTN Money and Airtel Money integration
- **Contact Unlock System**: Pay to unlock asset owner contact details
- **Payment History**: Track all payment transactions

### ✅ UI/UX Features
- **Material Design**: Clean, modern interface using React Native Paper
- **Navigation**: Bottom tab navigation with stack navigation for details
- **Responsive Design**: Optimized for different screen sizes
- **Loading States**: Proper loading indicators and error handling
- **Search & Filters**: Advanced search with category and price filters

## Tech Stack

- **React Native 0.81.4** - Mobile framework
- **TypeScript** - Type safety and better development experience
- **React Navigation 6** - Navigation library
- **React Native Paper** - Material Design components
- **Stripe React Native** - Payment processing
- **React Query/TanStack Query** - Data fetching and caching
- **Async Storage** - Local data persistence
- **React Hook Form** - Form management
- **Vector Icons** - Icon library

## Getting Started

### Prerequisites
- Node.js >= 18
- React Native development environment set up
- Android Studio or Xcode for device testing

### Installation

1. **Navigate to the project**
   ```bash
   cd /home/cipher/Desktop/Buld/Barter_it_mobile
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```
   API_URL=https://api.barterhub.com
   STRIPE_KEY=pk_test_your_stripe_publishable_key_here
   ```

4. **iOS setup** (iOS only)
   ```bash
   cd ios && pod install && cd ..
   ```

5. **Run the app**
   ```bash
   # For Android
   npx react-native run-android

   # For iOS
   npx react-native run-ios
   ```

## Key Features Implementation

### Authentication
- Context-based auth state management
- Async storage for persistence
- Email verification flow
- Password reset functionality

### Asset Management
- CRUD operations for assets
- Image upload support
- Category-based filtering
- Location-based search

### Payment System
- Stripe payment intents
- Mobile money integration
- Secure payment flow
- Transaction history

### Local Currency Support
- UGX (Ugandan Shilling)
- KES (Kenyan Shilling)
- ZAR (South African Rand)
- NGN (Nigerian Naira)
- GHS (Ghanaian Cedi)

**Built with ❤️ for African Communities**
