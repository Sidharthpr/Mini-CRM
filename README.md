# MiniCRM - React Native CRM Application

A modern, feature-rich Customer Relationship Management (CRM) application built with React Native and Expo. This app provides comprehensive tools for managing customers, leads, and business relationships with a clean, intuitive interface.

## 📱 Features

### 🔐 Authentication
- **Secure Login/Register** - Email and password authentication
- **Form Validation** - Real-time validation with user-friendly error messages
- **Token Management** - Automatic authentication token handling
- **Session Persistence** - Stay logged in across app restarts

### 👥 Customer Management
- **Customer List** - View all customers with search and filtering
- **Customer Details** - Comprehensive customer profiles
- **Add/Edit Customers** - Complete CRUD operations
- **Customer-Lead Relationship** - View associated leads for each customer
- **Search & Filter** - Find customers quickly with real-time search

### 🎯 Lead Management
- **Lead Pipeline** - Track leads through different stages
- **Lead Status** - New, Contacted, Converted, Lost
- **Lead Values** - Track monetary value of opportunities
- **Lead Details** - Comprehensive lead information and history
- **Status Management** - Update lead status with visual indicators

### 📊 Dashboard & Analytics
- **Business Overview** - Key metrics at a glance
- **Interactive Charts** - Pie charts and bar charts for lead distribution
- **Lead Statistics** - Count and value tracking by status
- **Recent Activity** - Latest customers and leads
- **Refresh Control** - Pull-to-refresh functionality

### 🎨 Modern UI/UX
- **Clean Design** - Professional, modern interface
- **Responsive Layout** - Works on all screen sizes
- **Dark/Light Theme Support** - Consistent color scheme
- **Intuitive Navigation** - Easy-to-use bottom tab navigation
- **Loading States** - Smooth user experience with proper loading indicators

## 🛠 Technology Stack

### Core Technologies
- **React Native** `0.81.4` - Cross-platform mobile development
- **Expo** `~54.0.10` - Development platform and tools
- **TypeScript** - Type-safe development
- **React** `19.1.0` - UI library

### State Management
- **Redux Toolkit** - Predictable state container
- **React Redux** - React bindings for Redux
- **Redux Persist** - Persist Redux state to AsyncStorage

### Form Handling
- **React Hook Form** `^7.63.0` - Performant forms with easy validation
- **Yup** `^1.7.1` - Schema validation library
- **@hookform/resolvers** - Validation resolvers for React Hook Form

### Navigation
- **React Navigation v7** - Navigation library
  - Stack Navigator - Screen-to-screen navigation
  - Bottom Tab Navigator - Tab-based navigation
  - Native Stack - Native navigation performance

### Data Visualization
- **React Native Chart Kit** `^6.12.0` - Beautiful charts and graphs
- **React Native SVG** - SVG support for charts

### Storage & Utilities
- **AsyncStorage** `^2.2.0` - Persistent local storage
- **Expo Vector Icons** - Comprehensive icon library

## 📁 Project Structure

```
MiniCRM/
├── App.tsx                    # Main app entry point
├── index.ts                   # Expo entry point
├── package.json              # Dependencies & scripts
├── app.json                  # Expo configuration
├── tsconfig.json             # TypeScript configuration
└── src/
    ├── components/           # Reusable UI components
    │   ├── Button.tsx        # Custom button component
    │   ├── Input.tsx         # Form input component
    │   ├── Card.tsx          # Container component
    │   └── index.ts          # Component exports
    ├── screens/             # Screen components
    │   ├── LoginScreen.tsx   # Authentication screens
    │   ├── RegisterScreen.tsx
    │   ├── DashboardScreen.tsx
    │   ├── CustomerListScreen.tsx
    │   ├── CustomerDetailsScreen.tsx
    │   ├── AddEditCustomerScreen.tsx
    │   ├── LeadListScreen.tsx
    │   ├── LeadDetailsScreen.tsx
    │   ├── AddEditLeadScreen.tsx
    │   ├── MainScreen.tsx    # Main navigation container
    │   └── index.ts          # Screen exports
    ├── store/               # Redux state management
    │   ├── index.ts         # Store configuration
    │   ├── authSlice.ts     # Authentication state
    │   ├── customerSlice.ts # Customer management state
    │   ├── leadSlice.ts     # Lead management state
    │   └── dashboardSlice.ts# Dashboard statistics state
    ├── services/            # API layer
    │   └── api.ts           # API service with mock data
    ├── types/               # TypeScript definitions
    │   ├── auth.ts          # Authentication types
    │   ├── crm.ts           # CRM business types
    │   └── api.ts           # API response types
    ├── constants/           # App constants
    │   ├── colors.ts        # Color palette
    │   └── typography.ts    # Typography system
    ├── utils/               # Utility functions
    │   └── validation.ts    # Form validation schemas
    ├── hooks/               # Custom React hooks
    │   └── redux.ts         # Typed Redux hooks
    └── __tests__/           # Unit tests
        ├── components/      # Component tests
        └── utils/           # Utility tests
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or later)
- **npm** or **yarn**
- **Expo CLI** (optional but recommended)
- **iOS Simulator** (for iOS development)
- **Android Studio/Emulator** (for Android development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/minicrm.git
   cd minicrm
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm start
   # or
   yarn start
   # or
   npx expo start
   ```

4. **Run on device/simulator**
   - **iOS**: Press `i` in the terminal or scan QR code with Expo Go app
   - **Android**: Press `a` in the terminal or scan QR code with Expo Go app
   - **Web**: Press `w` in the terminal (for web preview)

### Development Setup

1. **Install Expo CLI globally** (optional)
   ```bash
   npm install -g @expo/cli
   ```

2. **Environment Setup**
   - Ensure you have the latest version of Node.js
   - Install Watchman (for macOS users): `brew install watchman`
   - Setup Android Studio for Android development
   - Setup Xcode for iOS development (macOS only)

## 🔧 Available Scripts

```bash
# Start the development server
npm start

# Start with cleared cache
npm run start:clear

# Run iOS simulator
npm run ios

# Run Android emulator
npm run android

# Run web version
npm run web

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Type checking
npm run type-check

# Linting
npm run lint

# Format code
npm run format

# Build for production
npm run build

# Eject from Expo (not recommended unless necessary)
npm run eject
```

## 📱 App Navigation

### Authentication Flow
1. **Login Screen** - Email/password authentication
2. **Register Screen** - New user registration
3. **Automatic redirect** - To dashboard upon successful login

### Main App Flow
1. **Dashboard** - Overview of business metrics and recent activity
2. **Customers Tab** - Customer management and details
3. **Leads Tab** - Lead pipeline and management

### Screen Flow
```
Login/Register → Dashboard → Customer List → Customer Details
                      ↓
                 Lead List → Lead Details → Add/Edit Lead
                      ↓
                 Add/Edit Customer
```

## 🎨 Design System

### Color Palette
- **Primary**: `#007AFF` - Main brand color
- **Success**: `#34C759` - Success states, converted leads
- **Warning**: `#FF9500` - Warning states, contacted leads
- **Error**: `#FF3B30` - Error states, lost leads
- **Background**: `#f8f9fa` - App background
- **Surface**: `#ffffff` - Card backgrounds

### Typography
- **Headlines**: Roboto/San Francisco - 24-32px
- **Body Text**: System fonts - 16px
- **Captions**: System fonts - 14px
- **Small Text**: System fonts - 12px

### Components
- **Cards**: Subtle shadows, 16px border radius
- **Buttons**: Multiple variants (primary, secondary, outline)
- **Forms**: Floating labels, real-time validation
- **Icons**: Expo Vector Icons with consistent sizing

## 🔐 Authentication & Security

### Authentication Flow
1. User enters credentials
2. Credentials validated against mock user data
3. JWT token generated (simulated)
4. Token stored in AsyncStorage
5. Token included in API requests
6. Auto-logout on token expiration

### Security Features
- **Token-based authentication**
- **Secure storage** using AsyncStorage
- **Input validation** on all forms
- **Error handling** for all API calls
- **Auto-logout** on authentication errors

## 💾 Data Management

### State Management (Redux Toolkit)
- **Authentication State** - User session and tokens
- **Customer State** - Customer data and operations
- **Lead State** - Lead data and pipeline management
- **Dashboard State** - Analytics and metrics

### Data Persistence
- **AsyncStorage** for authentication tokens
- **Redux Persist** for offline capability
- **Mock API** with realistic data structure

### API Integration
- **Centralized API service** for all HTTP requests
- **Automatic token injection** for authenticated requests
- **Error handling** and retry logic
- **Mock data** for development and testing

## 📊 Charts & Analytics

### Dashboard Metrics
- **Total Customers** - Count of all customers
- **Total Leads** - Count of all leads
- **Total Value** - Sum of all lead values
- **Lead Distribution** - Pie chart by status
- **Lead Count** - Bar chart by status

### Chart Features
- **Interactive** - Touch-responsive charts
- **Color-coded** - Status-based color system
- **Responsive** - Adapts to screen sizes
- **Real-time updates** - Updates with data changes

## 🧪 Testing

### Testing Setup
- **Jest** for unit testing
- **React Native Testing Library** for component testing
- **TypeScript** for type safety testing

### Test Coverage
- **Components** - UI component functionality
- **Utils** - Utility function testing
- **Redux** - State management testing
- **API** - Service layer testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test Button.test.tsx
```

## 🔧 Configuration

### Expo Configuration (app.json)
```json
{
  "expo": {
    "name": "MiniCRM",
    "slug": "minicrm",
    "version": "1.0.0",
    "platforms": ["ios", "android", "web"],
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#007AFF"
    }
  }
}
```

### TypeScript Configuration
- **Strict mode** enabled
- **Path mapping** for cleaner imports
- **Expo TypeScript** base configuration

## 🚀 Deployment

### Development Build
```bash
# Create development build
expo build:ios
expo build:android
```

### Production Build
```bash
# Create production build
expo build:ios --type archive
expo build:android --type app-bundle
```

### App Store Deployment
1. **Build** production version
2. **Test** thoroughly on devices
3. **Submit** to App Store/Play Store
4. **Monitor** app performance and crashes

## 🤝 Contributing

### Development Workflow
1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Code Style
- **TypeScript** for type safety
- **ESLint** for code linting
- **Prettier** for code formatting
- **Conventional commits** for commit messages

### Pull Request Process
1. Update documentation if needed
2. Add tests for new functionality
3. Ensure all tests pass
4. Update README.md if necessary
5. Request code review

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

### Getting Help
- **Issues**: Create an issue on GitHub
- **Discussions**: Use GitHub Discussions
- **Email**: support@minicrm.app

### Known Issues
- **Chart rendering** may be slow on older devices
- **Large datasets** may impact performance
- **Offline sync** not yet implemented

### Roadmap
- [ ] **Offline support** with sync capability
- [ ] **Push notifications** for lead updates
- [ ] **Calendar integration** for appointments
- [ ] **File attachments** for customers/leads
- [ ] **Advanced reporting** and analytics
- [ ] **Team collaboration** features
- [ ] **API integration** with external CRM systems

## 🔄 Changelog

### Version 1.0.0 (Current)
- ✅ Initial release
- ✅ Authentication system
- ✅ Customer management
- ✅ Lead management
- ✅ Dashboard with analytics
- ✅ Mobile-responsive design

---
