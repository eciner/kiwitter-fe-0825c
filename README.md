# Kiwitter - Twitter Clone 🐦

A modern, feature-rich Twitter clone built with React, Redux Toolkit, and Tailwind CSS.

## � Table of Contents

- [Project Status](#-project-status)
- [Getting Started](#-getting-started)
- [Tech Stack](#%EF%B8%8F-tech-stack)
- [Project Structure](#-project-structure)
- [Available Scripts](#-available-scripts)
- [API Endpoints](#-api-endpoints-mock---miragejs)
- [Usage Examples](#-usage-examples)
- [Features](#-ui-highlights--design)
- [Troubleshooting](#%EF%B8%8F-troubleshooting)
- [Learning Resources](#-learning-resources)

## �📊 Project Status

### ✅ Completed Features

- **🔐 User Authentication**: JWT-based registration and login system
- **📝 Tweet Management**: Create, view, delete, and detail view of tweets (160 char limit)
- **💬 Social Interactions**: Like/unlike tweets, reply functionality with nested threading
- **👤 User Profiles**: View user-specific tweets and activity
- **📊 Multiple Timeline Views**:
  - Normal timeline (chronological feed)
  - Popular timeline (top tweets from last 24h sorted by likes)
- **⚡ Real-time Updates**: Optimistic UI updates with Redux state management
- **📱 Responsive Design**: Mobile-first design with Tailwind CSS
- **🧪 Mock API**: MirageJS for development and testing (100 tweets with replies)
- **🎨 Error Boundaries**: Error handling with ErrorBoundary component
- **�️ Protected Routes**: Authentication checks on protected pages
- **📋 Login Modal**: Modal-based login component for seamless UX

### 🔄 In Progress / Features to Enhance

- Advanced user profile features (bio, avatar, follow system)
- Search and filter functionality
- Tweet editing capability
- Notification system
- Dark mode theme toggle
- User suggestions/recommendations
- Trending topics
- Media upload for tweets

## 🛠️ Tech Stack

- **React 18.3** - UI Library
- **Redux Toolkit 2.11** - State Management
- **React Router DOM 5.2** - Client-side Routing
- **Tailwind CSS 3.4** - Utility-first CSS
- **Vite 5.4** - Build Tool & Dev Server
- **Axios** - HTTP Client
- **MirageJS** - API Mocking
- **React Hook Form** - Form Validation
- **React Toastify** - Notifications
- **Day.js** - Date Formatting
- **Bootstrap Icons** - Icon Library

## � Getting Started

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
   - Navigate to `http://localhost:5173`
   - You'll see the Kiwitter app with mock data ready to use

### Quick Test

- **Login Test Account**: Use any email and password (mock authentication)
- **Sample Data**: 100 pre-generated tweets with replies available
- **No Backend Setup**: All API calls are mocked with MirageJS

```
kiwitter-fe/
├── src/
│   ├── components/               # Reusable UI components
│   │   ├── Header.jsx           # Navigation header with user info
│   │   ├── Post.jsx             # Tweet display component
│   │   ├── PostEditor.jsx       # Create/edit tweet component
│   │   ├── Replies.jsx          # Display tweet replies
│   │   ├── ReplyEditor.jsx      # Create reply component
│   │   ├── Timeline.jsx         # Tweet feed display
│   │   ├── TimelineSelector.jsx # Timeline view switcher
│   │   ├── LoginModal.jsx       # Login modal dialog
│   │   └── ErrorBoundary.jsx    # Error handling component
│   ├── layouts/                  # Layout wrappers
│   │   ├── AuthLayout.jsx       # Auth page layout
│   │   └── PageLayout.jsx       # Main app layout
│   ├── pages/                    # Route pages
│   │   ├── Home.jsx             # Home timeline
│   │   ├── Login.jsx            # Login page
│   │   ├── Signup.jsx           # User registration
│   │   ├── Profile.jsx          # User profile page
│   │   └── Detail.jsx           # Tweet detail/thread view
│   ├── redux/                    # State management (Redux Toolkit)
│   │   ├── store.js             # Redux store configuration
│   │   ├── tweetsSlice.js       # Tweets state & reducers
│   │   ├── twitsSlice.js        # Alternative tweets slice
│   │   └── userSlice.js         # User state & reducers
│   ├── utils/                    # Helper functions & utilities
│   │   ├── auth.js              # Authentication utilities
│   │   ├── axios.js             # HTTP client configuration
│   │   └── devserver.js         # Development server setup
│   ├── icon/                     # Icon assets
│   ├── App.jsx                   # Root component
│   ├── main.jsx                  # App entry point
│   ├── App.css                   # App styles
│   └── index.css                 # Global styles
├── public/                       # Static assets
├── package.json                  # Dependencies & scripts
├── vite.config.js               # Vite configuration
├── tailwind.config.js           # Tailwind CSS configuration
├── postcss.config.js            # PostCSS configuration
└── eslint.config.js             # ESLint configuration
```

## 🎯 Available Scripts

```bash
npm run dev      # Start dev server at http://localhost:5173
npm run build    # Build for production (creates dist/ folder)
npm run preview  # Preview production build locally
npm run lint     # Run ESLint to check code quality
```

## 🔌 API Endpoints (Mock - MirageJS)

| Method | Endpoint             | Description             | Status  |
| ------ | -------------------- | ----------------------- | ------- |
| POST   | `/login`             | User login              | ✅ Done |
| POST   | `/signup`            | User registration       | ✅ Done |
| GET    | `/twits`             | Get all tweets          | ✅ Done |
| POST   | `/twits`             | Create tweet            | ✅ Done |
| DELETE | `/twits/:id`         | Delete tweet            | ✅ Done |
| POST   | `/twits/:id/like`    | Like tweet              | ✅ Done |
| DELETE | `/twits/:id/like`    | Unlike tweet            | ✅ Done |
| POST   | `/twits/:id/replies` | Reply to tweet          | ✅ Done |
| GET    | `/twits/popular`     | Get popular tweets      | ✅ Done |
| GET    | `/twits/:id`         | Get tweet detail/thread | ✅ Done |
| GET    | `/users/:username`   | Get user profile        | ✅ Done |

## 💡 Usage Examples

### Running the Development Server

```bash
npm install      # Install dependencies (first time only)
npm run dev      # Start the development server
# Open browser to http://localhost:5173
```

### Building for Production

```bash
npm run build    # Creates optimized build in dist/ folder
npm run preview  # Preview production build locally
```

### Code Quality

```bash
npm run lint     # Check for linting issues
# Fix common issues: eslint . --fix
```

## 🎨 UI Highlights & Design

- **Primary Theme Color**: `#121054` (KiWi Indigo)
- **Responsive Design**: Fully responsive for desktop, tablet, and mobile devices
- **Toast Notifications**: User feedback for actions (success, error, info)
- **Real-time Character Counter**: Tweet composer with live character count
- **Loading States**: Smooth loading indicators during API calls
- **Error Handling**: Comprehensive error boundary and user feedback
- **Form Validation**: Client-side validation with React Hook Form
- **Dark-Friendly**: Adaptable color scheme for various themes

## 🔐 Authentication & Security

- **JWT Tokens**: JSON Web Tokens for secure authentication
- **LocalStorage**: Tokens stored securely in browser localStorage
- **Protected Routes**: Authorization checks prevent unauthorized access
- **Token Expiration**: Automatic token refresh and logout on expiration
- **Password Encryption**: Server-side password hashing (mock implementation)

## 🧪 Testing & Development

- **Mock API (MirageJS)**: Complete API mocking for offline development
- **Sample Data**: 100 pre-generated tweets with 3 replies each
- **ESLint**: Automatic code quality checks
- **Hot Module Replacement**: Fast refresh during development with Vite

## 📦 Dependencies Overview

| Package          | Version | Purpose                 |
| ---------------- | ------- | ----------------------- |
| React            | 18.3.1  | UI library              |
| Redux Toolkit    | 2.11.2  | State management        |
| React Router DOM | 5.2     | Client-side routing     |
| Tailwind CSS     | 3.4.12  | Utility-first CSS       |
| Vite             | 5.4.1   | Build tool & dev server |
| Axios            | 1.7.7   | HTTP client             |
| MirageJS         | 0.1.48  | API mocking             |
| React Hook Form  | 7.53.0  | Form handling           |
| React Toastify   | 11.0.5  | Notifications           |
| Day.js           | 1.11.19 | Date formatting         |
| Bootstrap Icons  | 1.13.1  | Icon library            |

## 📝 Development Notes

- **Mock Server**: MirageJS generates 100 sample tweets with 3 replies each on startup
- **JWT Tokens**: Stored in `localStorage` for persistent authentication across sessions
- **PropTypes**: All components validate prop types for type safety
- **ESLint Configuration**: Enforces code quality and React best practices
- **Separation of Concerns**: Clean folder structure (components, pages, redux, utils)
- **Redux Patterns**: Slices pattern for reducers, actions, and state management
- **Hot Reload**: Vite provides fast refresh (~100ms) for rapid development
- **Component Reusability**: Designed for composition and flexible prop passing

## 🛠️ Troubleshooting

### Issue: "Cannot find module" errors

**Solution**: Run `npm install` to ensure all dependencies are installed

### Issue: Port 5173 already in use

**Solution**: Vite will automatically try the next available port, or specify: `npm run dev -- --port 3000`

### Issue: Tweets not appearing

**Solution**: Check browser console for errors, ensure MirageJS is initialized in `main.jsx`

### Issue: Authentication token expired

**Solution**: Log out and log in again, or clear localStorage and refresh

## 🎓 Learning Resources

This project demonstrates:

- React 18 functional components and hooks
- Redux Toolkit slices and async thunks
- React Router navigation and protected routes
- Tailwind CSS utility-first styling
- Responsive design patterns
- Form validation with React Hook Form
- HTTP requests with Axios
- API mocking with MirageJS
- Component composition and reusability
- State management best practices
- WorkinTech Frontend Development Bootcamp curriculum

## 📄 License

Part of WorkinTech Frontend Development Bootcamp - Educational Project
