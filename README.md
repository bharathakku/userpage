# YourDelivery - Partner First Logistics

A modern, responsive delivery and logistics platform built with Next.js, designed to connect customers with delivery services seamlessly.

## 🚀 Live Demo

The application is running at: `http://localhost:3001`

## 📱 Features

### Core Features
- **Vehicle Selection**: Choose from Trucks, 2-Wheeler, and All India Parcel services
- **Real-time Booking**: Complete booking flow with fare calculation
- **Order Tracking**: Live order tracking with driver information
- **Digital Wallet**: Integrated wallet system with payment history
- **User Profile Management**: Complete profile management with saved addresses
- **Referral System**: Earn rewards by referring friends
- **Help & Support**: Comprehensive FAQ and customer support

### Pages Overview

#### 1. Home Page (`/`)
- Vehicle type selection (Trucks, 2 Wheeler, All India Parcel)
- Wallet balance display
- Recent activity section
- Location picker with map placeholder
- Quick action buttons

#### 2. Orders Page (`/orders`)
- Active orders with real-time status
- Order history with filtering
- Driver contact information
- Order cancellation with reason selection
- Order tracking and details

#### 3. Payments Page (`/payments`)
- Wallet balance and management
- Payment history with transaction details
- Add money functionality with bonus offers
- Payment method management
- Special offers and cashback

#### 4. Support Page (`/support`)
- Interactive FAQ section
- Multiple contact options (Chat, Call, Email)
- Search functionality
- Support categories
- Terms and conditions preview

#### 5. Profile Page (`/profile`)
- User profile information
- Saved addresses management
- Referral system with earnings tracking
- Account settings
- Privacy and terms access

#### 6. Booking Flow (`/booking/review`)
- Trip details confirmation
- Route visualization
- Fare breakdown
- Payment method selection
- Coupon application
- Booking confirmation

## 🛠 Technical Stack

### Frontend
- **Next.js 15.5.2** - React framework with App Router
- **React 19.1.0** - UI library
- **Tailwind CSS 4** - Utility-first CSS framework
- **Lucide React** - Modern icon library
- **Radix UI** - Headless UI components

### State Management
- **React Context API** - Global state management
- **useReducer Hook** - Complex state logic
- Custom API simulation layer

### UI Components
- Custom reusable components
- Responsive design patterns
- Accessible interface elements
- Loading states and error handling

## 📁 Project Structure

```
userpage/
├── app/                          # Next.js App Router
│   ├── booking/
│   │   └── review/page.jsx      # Booking review page
│   ├── orders/page.jsx          # Orders tracking page
│   ├── payments/page.jsx        # Payments and wallet page
│   ├── profile/page.jsx         # User profile page
│   ├── support/page.jsx         # Help and support page
│   ├── layout.js                # Root layout with providers
│   ├── page.js                  # Home page
│   └── globals.css              # Global styles
├── components/
│   ├── layout/
│   │   └── header.jsx           # Navigation header
│   ├── modals/
│   │   └── cancel-order-modal.jsx # Order cancellation modal
│   └── ui/                      # Reusable UI components
│       ├── button.jsx           # Button component
│       ├── card.jsx             # Card component
│       └── notification.jsx    # Notification system
├── contexts/
│   └── AppContext.js            # Global state management
├── lib/
│   └── utils.js                 # Utility functions
├── public/                      # Static assets
└── README.md                    # Project documentation
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js 18.0 or later
- npm or yarn package manager

### Installation Steps

1. **Navigate to the project directory:**
   ```bash
   cd "D:\Bharath S Anand\next\client\userpage"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3001` (or the port shown in terminal)

### Build for Production

```bash
npm run build
npm start
```

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#2563EB)
- **Success**: Green (#16A34A)
- **Warning**: Orange (#EA580C)
- **Error**: Red (#DC2626)
- **Neutral**: Gray shades

### Typography
- **Font Family**: Geist Sans (primary), Geist Mono (monospace)
- **Responsive scaling**: Based on Tailwind's type scale

### Components
- Consistent spacing using Tailwind's spacing scale
- Rounded corners: `rounded-md`, `rounded-lg`, `rounded-xl`
- Shadows: Subtle elevation with `shadow-sm`, `shadow-lg`

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px

### Key Features
- Mobile-first approach
- Collapsible navigation
- Responsive grid layouts
- Touch-friendly interface elements

## 🚀 State Management

### Context Structure
```javascript
{
  user: {
    // User profile information
    name, phone, email, profileType, referralCode
  },
  wallet: {
    // Wallet and payment information
    balance, currency
  },
  orders: {
    // Order management
    active: [], history: []
  },
  addresses: [
    // Saved addresses
  ],
  notifications: [
    // App notifications
  ],
  loading: false,
  error: null
}
```

### API Integration Ready
- Simulated API calls with proper loading states
- Error handling and user feedback
- Easy to replace with real backend endpoints
- Proper data flow patterns

## 🔗 Backend Integration

### Preparation for Backend Connection

The app is structured to easily connect with a backend API:

#### API Endpoints Structure (Ready to implement)
```javascript
// User Management
POST /api/auth/login
GET /api/user/profile
PUT /api/user/profile
GET /api/user/addresses
POST /api/user/addresses

// Order Management
POST /api/orders
GET /api/orders
PUT /api/orders/:id
DELETE /api/orders/:id

// Payment System
GET /api/wallet/balance
POST /api/wallet/add-money
GET /api/payments/history

// Support System
GET /api/support/faq
POST /api/support/contact
```

#### Data Models
The app expects standard REST API responses with JSON data matching the current state structure.

## 🧪 Testing & Development

### Development Tools
- Hot reload enabled
- Error boundary handling
- Development notifications
- Console logging for debugging

### Browser Support
- Chrome (recommended)
- Firefox
- Safari
- Edge

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
# Deploy to Vercel
```

### Other Platforms
The app can be deployed on any platform that supports Next.js:
- Netlify
- Railway
- AWS Amplify
- Digital Ocean App Platform

## 📞 Support

### Features Implemented
- ✅ Responsive design matching provided mockups
- ✅ Complete navigation system
- ✅ Vehicle selection and booking flow
- ✅ Payment and wallet management
- ✅ Order tracking system
- ✅ User profile with referral system
- ✅ Help and support with FAQ
- ✅ State management ready for API integration
- ✅ Notification system
- ✅ Modal components (cancellation flow)

### Future Enhancements
- 🔄 Real-time order tracking with WebSocket
- 🔄 Push notifications
- 🔄 Advanced map integration
- 🔄 Payment gateway integration
- 🔄 Multi-language support
- 🔄 Dark mode theme

## 🤝 Contributing

The codebase follows React and Next.js best practices:
- Component-based architecture
- Proper state management
- Responsive design principles
- Accessibility considerations
- Clean code structure

## 📄 License

This project is created for demonstration purposes and follows modern web development practices.

---

**Note**: This application is currently running with simulated data and API calls. All functionality is implemented and ready for backend integration. The UI/UX matches the provided designs and includes additional features for a complete user experience.
