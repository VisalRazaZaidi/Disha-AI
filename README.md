# Disha AI - Your Personal Career Guide

A hackathon-winning AI-powered career advisor platform specifically designed for Indian students. Built with React, Firebase, and Google Gemini AI.

## 🏆 Project Overview

Disha AI provides hyper-personalized career guidance using Google's cutting-edge AI technology. The platform analyzes students' interests, academic strengths, and existing skills to recommend career paths tailored for the Indian job market.

### Key Features

- **Seamless Onboarding**: Anonymous sign-in with intuitive multi-step wizard
- **AI-Powered Recommendations**: Google Gemini API generates personalized career suggestions
- **Skill Gap Analysis**: Visual comparison between required and existing skills (green for owned, blue for needed)
- **Detailed Roadmaps**: Comprehensive learning paths with Indian resources (NPTEL, Swayam, etc.)
- **Mobile Responsive**: Fully optimized for all device sizes
- **Real-time Updates**: Dynamic content generation and caching

## 🛠 Tech Stack

- **Frontend**: Vite + React 18 + JavaScript
- **Styling**: Tailwind CSS with custom design system
- **Backend**: Firebase (Firestore + Cloud Functions)
- **Authentication**: Firebase Auth (Anonymous)
- **AI Integration**: Google Gemini API (gemini-2.0-flash-exp)
- **Animations**: Framer Motion
- **Hosting**: Firebase Hosting

## 🚀 Quick Setup

### Prerequisites

- Node.js (v18 or higher)
- Firebase CLI
- Google Cloud Platform account
- Firebase project

### 1. Clone and Install

```bash
git clone <repository-url>
cd disha-ai
npm install
```

### 2. Firebase Setup

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase project
firebase init

# Select:
# - Hosting
# - Functions 
# - Firestore
```

### 3. Environment Configuration

Create `.env` file in the root directory:

```bash
cp .env.example .env
```

Add your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. Set up Gemini API

```bash
# Configure Gemini API key for Cloud Functions
firebase functions:config:set gemini.api_key="your_gemini_api_key"
```

### 5. Deploy Cloud Functions

```bash
cd functions
npm install
cd ..
firebase deploy --only functions
```

### 6. Deploy to Firebase Hosting

```bash
npm run build
firebase deploy --only hosting
```

## 🔧 Development

### Run locally

```bash
# Start development server
npm run dev

# Start Firebase emulators (optional)
firebase emulators:start
```

### Available Scripts

- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run firebase:serve` - Serve with Firebase hosting
- `npm run firebase:deploy` - Deploy to Firebase

## 📁 Project Structure

```
disha-ai/
├── src/
│   ├── components/
│   │   ├── LandingPage.jsx      # Hero section & landing
│   │   ├── OnboardingWizard.jsx # Multi-step profile creation
│   │   ├── Dashboard.jsx        # Main user dashboard
│   │   ├── CareerCard.jsx       # Individual career recommendations
│   │   └── RoadmapModal.jsx     # Detailed roadmap with skill gap analysis
│   ├── hooks/
│   │   └── useAuth.js           # Firebase authentication hook
│   ├── services/
│   │   ├── firebase.js          # Firebase configuration
│   │   └── userService.js       # Firestore operations
│   ├── App.jsx                  # Main app component
│   ├── main.jsx                 # React entry point
│   └── index.css                # Tailwind + custom styles
├── functions/
│   └── src/
│       └── index.ts             # Cloud Functions with AI integration
├── public/
├── firebase.json                # Firebase configuration
├── tailwind.config.js           # Tailwind customization
└── vite.config.js              # Vite configuration
```

## 🎨 Design System

### Brand Colors

- **Primary**: Deep Indigo (#6366f1) - Professional, trustworthy
- **Accent**: Emerald Green (#34d399) - Skills you have
- **Electric**: Electric Blue (#60a5fa) - Skills to learn
- **Background**: Light gray (#f9fafb) - Clean, minimal

### Typography

- **Font**: Inter (clean, modern, readable)
- **Headings**: Bold, gradient text effects for impact
- **Body**: Medium contrast, optimized for readability

## 🧪 Key Components

### Skill Gap Analysis (Winning Feature)

The platform's most innovative feature visually compares required skills vs. user skills:

- ✅ **Green tags**: Skills the user already has
- 🎯 **Blue tags**: Skills the user needs to learn
- 📊 **Progress bar**: Overall skill match percentage
- 🎯 **Interactive**: Click to explore detailed roadmaps

### AI Integration

- **Secure**: Gemini API calls only through Cloud Functions
- **Structured**: JSON-based prompts for consistent outputs
- **India-focused**: Prompts specifically mention Indian market context
- **Caching**: Generated content saved to Firestore for performance

## 🔒 Security

- Anonymous authentication for frictionless onboarding
- Firestore security rules prevent unauthorized access
- API keys properly secured in Cloud Functions
- Client-side validation with server-side verification

## 📱 Mobile Optimization

- Fully responsive design using Tailwind CSS
- Touch-optimized interactions
- Optimized loading states and animations
- Progressive enhancement approach

## 🚀 Performance

- **Vite**: Lightning-fast development and builds
- **Code splitting**: Lazy loading of components
- **Optimized images**: Properly sized and compressed
- **Caching**: Firebase CDN + intelligent data caching

## 🎯 Hackathon Scoring Alignment

### Technical Merit (40%)
- Modern tech stack (React 18, Firebase, Gemini AI)
- Clean, well-documented code
- Proper error handling and loading states
- Responsive design and performance optimization

### Innovation (20%)
- Visual skill gap analysis (unique feature)
- AI-powered personalization
- Seamless anonymous onboarding
- Real-time content generation

### Alignment with Cause (15%)
- Specifically targets Indian students
- Includes Indian resources (NPTEL, Swayam)
- Addresses education-to-career pipeline
- Scalable solution for mass impact

### Market Feasibility (15%)
- Clear monetization paths (premium features, partnerships)
- Scalable serverless architecture
- Low operational costs
- Large addressable market (Indian students)

### User Experience (10%)
- Intuitive, wizard-based onboarding
- Beautiful, clean interface
- Smooth animations and transitions
- Mobile-first design

## 📄 License

This project is built for the Google Gen AI Exchange Hackathon.

## 🤝 Contributing

This is a hackathon project. For questions or collaboration opportunities, please reach out to the development team.

---

**Disha AI** - From Career Confusion to Crystal Clarity 🌟✨
