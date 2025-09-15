# Atleta Jersey Claiming System

## Setup Instructions

### 1. Firebase Configuration

1. Create a Firebase project at https://console.firebase.google.com/
2. Enable Firestore Database in your Firebase project
3. Enable Authentication and set up Google as a sign-in provider
4. Create a `.env.local` file in the root directory with the following variables:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

4. Replace the placeholder values with your actual Firebase project credentials

### 2. Firestore Security Rules

Set up the following security rules in your Firestore database:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /jerseyClaims/{document} {
      allow read, write: if true; // Adjust based on your security requirements
    }
  }
}
```

### 3. Running the Application

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Features

- **Atleta Logo Background**: The main page features the Atleta logo as a full-screen background
- **Google Authentication**: Secure sign-in using Google accounts with @rvu.edu.in email validation
- **Uniqueness Check**: Prevents duplicate jersey claims using Firestore
- **Holographic UI**: Success and error pages feature holographic effects similar to Pokemon cards
- **Responsive Design**: Works on both desktop and mobile devices

## File Structure

- `src/app/page.tsx` - Main landing page with Google Auth button
- `src/app/success/page.tsx` - Success page with holographic tick
- `src/app/error/page.tsx` - Error page with holographic cross
- `src/components/GoogleAuthButton.tsx` - Google authentication component
- `src/components/HolographicTick.tsx` - Success animation component
- `src/components/HolographicCross.tsx` - Error animation component
- `src/lib/firebase.ts` - Firebase configuration
