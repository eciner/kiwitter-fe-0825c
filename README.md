# Kiwitter – Twitter Clone Frontend

A fully functional Twitter clone built with React, Redux Toolkit, and Tailwind CSS. This project demonstrates modern React patterns, state management best practices, and component-driven architecture.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Core Features](#core-features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API Endpoints (Mock)](#api-endpoints-mock)
- [Architecture Highlights](#architecture-highlights)
- [Available Scripts](#available-scripts)
- [Development Notes](#development-notes)
- [Troubleshooting](#troubleshooting)
- [Learning Outcomes](#learning-outcomes)

## 🎯 Project Overview

Kiwitter is a fully functional Twitter clone featuring real-time interactions, nested conversations, and a responsive design. Built as part of the WorkinTech Frontend Development Bootcamp, this project showcases modern React patterns, Redux state management, and component-driven architecture.

## ✅ Core Features

- **🔐 Authentication System**

  - JWT-based registration and login
  - Token persistence via localStorage
  - Modal-based login for seamless UX
  - Protected routes with authorization checks
  - Automatic session restoration on page reload

- **📝 Tweet Management**

  - Create tweets (160 character limit)
  - Delete tweets (owner-only)
  - View tweet details and nested threads
  - Real-time character counter with visual feedback
  - Delete functionality with ownership verification

- **💬 Social Interactions**

  - Like/unlike tweets with optimistic UI updates
  - Full like functionality for nested content (replies and reply-to-reply tweets)
  - Nested reply system (threaded conversations)
  - Reply to tweets and replies directly from timelines
  - Detailed conversation views with parent tweet context
  - Newest-first reply sorting for chronological readability
  - Recursive like tracking across all conversation depths

- **👤 User Profiles**

  - View user-specific tweets, replies, and liked tweets
  - Tab-based navigation (Tweets / Replies / Likes)
  - Profile information display
  - Ownership-based action visibility (delete buttons for own posts only)
  - Comprehensive likes display including nested tweet likes

- **📊 Multiple Timeline Modes**

  - **Timeline**: Chronological feed of all tweets
  - **Tweets**: User's own tweets only
  - **Replies**: User's reply history
  - **Most Liked**: Popular tweets from last 24 hours (sorted by likes)

- **🎨 UI/UX Excellence**
  - Responsive mobile-first design
  - Smooth fade-in animations and transitions
  - Toast notifications for user feedback (success and error messages)
  - Error boundaries for graceful error handling
  - Loading states during async operations
  - Custom brand identity (raven logo, KiWi Indigo theme)

## 🛠️ Tech Stack

### Core Technologies

- **[React 18.3](https://react.dev/)** - UI library with hooks and functional components
- **[Redux Toolkit 2.11](https://redux-toolkit.js.org/)** - State management with slices pattern
- **[React Router DOM 5.2](https://v5.reactrouter.com/)** - Client-side routing
- **[Tailwind CSS 3.4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Vite 5.4](https://vitejs.dev/)** - Next-generation frontend build tool

### Supporting Libraries

- **[Axios 1.7.7](https://axios-http.com/)** - HTTP client with interceptors
- **[MirageJS 0.1.48](https://miragejs.com/)** - API mocking for development
- **[jwt-decode 4.0.0](https://github.com/auth0/jwt-decode)** - JWT token decoding
- **[React Toastify 11.0.5](https://fkhadra.github.io/react-toastify/)** - Toast notifications
- **[Day.js 1.11.19](https://day.js.org/)** - Date formatting and manipulation
- **[Bootstrap Icons 1.13.1](https://icons.getbootstrap.com/)** - Icon library
- **[PropTypes 15.8.1](https://www.npmjs.com/package/prop-types)** - PropTypes runtime type checking for components

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm installed
- Modern web browser (Chrome, Firefox, Safari, or Edge)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/kiwitter-fe.git
   cd kiwitter-fe
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open in browser**
   - Navigate to `http://localhost:5176` (configured in vite.config.js)
   - The app will launch with 100 pre-generated tweets and replies

### Quick Test

The app uses MirageJS for a complete mock backend - no server setup required!

- **Test Login**: Use any username from the mock data (e.g., `chaotic_orange`, `sunny_rose`) with any password
- **Create Account**: Sign up with any credentials - new users are automatically added to the mock database
- **Sample Data**: 100 tweets with 3 nested replies each, generated on startup
- **Full Functionality**: All CRUD operations, likes, replies, and authentication work seamlessly

## 📁 Project Structure

```
kiwitter-fe/
├── dist/                         # Production build output
├── node_modules/                 # Installed dependencies
├── public/                       # Static assets
├── src/
│   ├── components/               # Reusable UI components
│   │   ├── ErrorBoundary.jsx     # Error handling wrapper
│   │   ├── Header.jsx            # Navigation & user info
│   │   ├── LoginModal.jsx        # Modal login form
│   │   ├── Post.jsx              # Tweet display card
│   │   ├── PostEditor.jsx        # Tweet/reply composer
│   │   ├── Replies.jsx           # Reply list container
│   │   ├── ReplyEditor.jsx       # Reply form component
│   │   ├── Timeline.jsx          # Tweet feed display
│   │   └── TimelineSelector.jsx  # Mode switcher tabs
│   ├── hooks/                    # Custom React hooks
│   │   └── useLogin.js           # Login-related hook helpers
│   ├── layouts/                  # Layout wrappers
│   │   ├── AuthLayout.jsx        # Auth pages wrapper
│   │   └── PageLayout.jsx        # Main app layout
│   ├── pages/                    # Route-level pages
│   │   ├── Detail.jsx            # Tweet detail/thread view
│   │   ├── Home.jsx              # Home timeline
│   │   ├── Login.jsx             # Login page
│   │   ├── Profile.jsx           # User profile view
│   │   └── Signup.jsx            # Registration page
│   ├── redux/                    # Redux Toolkit state
│   │   ├── store.js              # Store configuration
│   │   ├── tweetsSlice.js        # Tweets state & selectors
│   │   └── userSlice.js          # Auth state & user info
│   ├── utils/                    # Helper functions
│   │   ├── auth.js               # LocalStorage token helpers
│   │   ├── axios.js              # HTTP client config
│   │   ├── devserver.js          # MirageJS mock server
│   │   └── ownership.js          # Authorization checks
│   ├── icon/                     # SVG logo assets
│   ├── App.jsx                   # Root component
│   ├── main.jsx                  # Entry point
│   ├── App.css                   # Component styles
│   └── index.css                 # Global styles + animations
├── .gitignore                    # Git ignore rules
├── eslint.config.js              # ESLint rules
├── index.html                    # Vite HTML entry
├── package.json                  # Dependencies & scripts
├── package-lock.json             # npm lockfile
├── postcss.config.js             # PostCSS plugins
├── README.md                     # Project documentation
├── sessions.md                   # Development sessions log
├── tailwind.config.js            # Tailwind theme & colors
└── vite.config.js                # Vite configuration
```

## 🌐 API Endpoints (Mock)

All endpoints are provided by MirageJS mock server configured in `src/utils/devserver.js`.

### Authentication

| Method | Endpoint  | Description       | Auth Required |
| ------ | --------- | ----------------- | ------------- |
| POST   | `/login`  | User login        | ❌            |
| POST   | `/signup` | User registration | ❌            |

### Tweets

| Method | Endpoint              | Description               | Auth Required |
| ------ | --------------------- | ------------------------- | ------------- |
| GET    | `/tweets`             | Get all tweets            | Optional      |
| POST   | `/tweets`             | Create new tweet          | ✅            |
| GET    | `/tweets/:id`         | Get tweet detail/thread   | Optional      |
| DELETE | `/tweets/:id`         | Delete tweet (owner only) | ✅            |
| POST   | `/tweets/:id/like`    | Like tweet                | ✅            |
| DELETE | `/tweets/:id/like`    | Unlike tweet              | ✅            |
| POST   | `/tweets/:id/replies` | Reply to tweet            | ✅            |

### Users

| Method | Endpoint           | Description      | Auth Required |
| ------ | ------------------ | ---------------- | ------------- |
| GET    | `/users/me`        | Get current user | ✅            |
| GET    | `/users/:username` | Get user profile | Optional      |

**Note**: When authenticated, the `Authorization` header should contain the JWT token in `Bearer <token>` format.

## 🏗️ Architecture Highlights

### Redux Toolkit State Management

- **Centralized State**: Tweets and authentication stored in single Redux store
- **Optimistic Updates**: UI updates immediately, then syncs with API
- **Selector Patterns**: Filtered views for timeline modes (All, Likes, Replies, etc.)
- **Nested Reply Handling**: Recursive helpers support arbitrary conversation depth

### Component-Driven Design

- **Reusable Components**: PropTypes validation across all components
- **Separation of Concerns**: Clear distinction between pages, layouts, and components
- **Conditional Styling**: Reply and main tweet display with appropriate visual hierarchy
- **Error Boundaries**: Graceful error handling prevents white-screen failures

### Authentication Flow

- **Token Management**: JWT-like token generation and base64 decoding
- **LocalStorage Persistence**: Tokens persist across browser sessions
- **Axios Interceptors**: Automatic token injection in request headers
- **Session Restoration**: Automatic login on page reload if valid token exists
- **401 Handling**: Automatic logout on authentication failures

### Mock API Integration

- **100 Pre-generated Tweets**: Realistic sample data for testing
- **Nested Replies**: Each tweet includes up to 3 replies for testing threads
- **Recursive Lookup**: Tweet/reply functions support nested structure traversal
- **User-Specific Tracking**: Like status stored per user across all nesting levels
- **Token-Based Authorization**: Simulates real authentication for protected endpoints
- **Recursive Like Handling**: `setLikedByUserRecursive()` ensures `likedByUser` flag accuracy at all depths
- **Idempotent Like Operations**: Like/unlike endpoints return consistent `{ count, likedByUser }` format

### UI/UX Features

- **Responsive Design**: Mobile-first approach using Tailwind CSS
- **Custom Theme**: KiWi Indigo color scheme with custom typography
- **Animations**: Fade-in effects with staggered 50ms delays for lists
- **Toast Feedback**: Non-intrusive notifications for all user actions
- **Relative Timestamps**: Human-readable dates using Day.js (e.g., "2 hours ago")
- **Loading States**: Visual indicators during async operations
- **Character Counter**: Real-time validation with color feedback (red at 160 chars)
- **Brand Identity**: Custom raven logo with light/dark variants

## 📜 Available Scripts

```bash
# Development
npm run dev      # Start dev server at http://localhost:5176
npm run build    # Build for production (output: dist/)
npm run preview  # Preview production build locally

# Code Quality
npm run lint     # Run ESLint checks
```

## 📝 Development Notes

### Key Implementation Details

- **Port Configuration**: Dev server runs on port `5176` (configured in `vite.config.js`)
- **Mock Data Generation**: MirageJS generates 100 tweets with 3 replies each on startup
- **Token Format**: JWT-like structure with base64-encoded header/payload/signature
- **Reply Sorting**: Newest-first display using `[...replies].sort((a, b) => b.createDate - a.createDate)`
- **Recursive Operations**: Tweet/reply lookup and deletion support nested structures
- **Recursive Like Tracking**: `setLikedByUserRecursive()` traverses entire tweet tree to set `likedByUser` flags
- **Timeline Modes**: Implemented via Redux selectors with filtering logic
- **Ownership Checks**: `isPostOwner()` utility compares decoded token `sub` with `authorId`
- **Axios Interceptor**: Automatically clears auth state on 401 responses
- **Mock Auth Hardening**: Auth-required routes return 401 for missing/invalid tokens
- **Like/Unlike Consistency**: Like endpoints use `findTweetByIdRecursive()` to handle nested tweets
- **Package Manager**: Use npm with `package-lock.json` (yarn is not supported)

### Custom Tailwind Theme

```javascript
colors: {
  primary: '#121054',   // KiWi Indigo
  accent: '#1a1670',    // Accent purple
  dark: '#0a0830',      // Dark background
}
fontFamily: {
  'display': ['Kite One', 'cursive'],
  'heading': ['Domine', 'serif'],
  'body': ['Nunito', 'sans-serif'],
}
```

### Code Quality Standards

- ✅ **PropTypes**: All components have runtime type validation
- ✅ **ESLint**: React best practices enforced
- ✅ **No Console Logs**: Production code is clean (errors use toasts)
- ✅ **Consistent Styling**: Tailwind utility patterns across all components
- ✅ **Hot Module Replacement**: Vite provides ~100ms refresh cycles

## 🔧 Troubleshooting

### Common Issues

**"Cannot find module" errors**

- Run `npm install` to ensure all dependencies are installed
- Delete `node_modules/` and `package-lock.json`, then reinstall

**Port already in use**

- Default port is 5176 (not 5173)
- Vite will automatically try next available port
- Or specify custom port: `npm run dev -- --port 3000`

**Tweets not appearing**

- Check browser console for errors
- Verify MirageJS is initialized in `main.jsx`
- Ensure devserver.js is imported in App.jsx

**Authentication issues**

- Token stored in localStorage under key determined by auth.js
- Log out and log back in to refresh token
- Clear localStorage and refresh if persistent

**Build errors**

- Ensure all `.jsx` file extensions are explicit in imports
- Check that PropTypes are imported where used
- Verify Tailwind classes are valid

## 🎓 Learning Outcomes

This project demonstrates practical implementation of:

- **React 18**: Functional components, hooks (useState, useEffect, useSelector, useDispatch)
- **Redux Toolkit**: Slices pattern, reducers, actions, selectors, and centralized state
- **React Router v5**: Client-side routing with params and protected routes
- **Tailwind CSS**: Utility-first styling with custom theme extensions
- **Component Architecture**: Separation of concerns (pages/layouts/components/utils)
- **State Patterns**: Optimistic updates, recursive data structures, filtering
- **Authentication**: Token-based auth with localStorage persistence
- **API Integration**: HTTP client setup, interceptors, mock API development
- **Error Handling**: Error boundaries, toast notifications, graceful degradation
- **Code Quality**: PropTypes validation, ESLint rules, consistent patterns

## 📄 License

Educational project developed as part of **WorkinTech Frontend Development Bootcamp** curriculum.

---

**Built with ❤️ using React, Redux Toolkit, and Tailwind CSS**
