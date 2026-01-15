# Kiwitter – Development Sessions Log

Comprehensive, chronologically-ordered development log documenting the evolution from raw baseline to fully-featured Twitter clone. This log is derived from analyzing the actual codebase and identifying all changes.

## Document Purpose

This document serves as:

- **Source of truth** for what was built and when
- **Dependency tracker** to show why each session was necessary before the next
- **Reference guide** for developers understanding the architecture decisions
- **Validation** that all differences vs. baseline are documented

All session ordering is based on logical dependency analysis (e.g., state setup before API calls, routing before pages consuming routes).

**Standard Session Format:**

- Goal
- Key changes
- Files/areas touched
- Result
- Notes / follow-ups (optional)

---

## Project Evolution Summary

**From Baseline to Current:**

The raw baseline (`references/kiwitter-fe-initial-main`) was a minimal Vite/React scaffold:

- 3 placeholder page components at root level (Login.jsx, Signup.jsx, PageLayout.jsx as placeholder)
- Basic routing with no state management
- Minimal styling (barebones Tailwind + index.css)
- No authentication, API, or data persistence
- No reusable components or modular structure

The current project transforms this into a **full-featured Twitter clone** with:

- ✅ Redux Toolkit state management (tweets and user authentication)
- ✅ MirageJS mock API (100 tweets with 3 nested replies each, 10 users, full CRUD operations)
- ✅ 9 reusable components (Post, Timeline, Header, LoginModal, Replies, ReplyEditor, TimelineSelector, PostEditor, ErrorBoundary)
- ✅ 5 structured pages (Home, Detail, Profile, Login, Signup)
- ✅ 4 utility modules (auth, axios, devserver, ownership)
- ✅ JWT token persistence and session restoration
- ✅ Nested replies system with recursive helpers
- ✅ 4 timeline modes (Timeline, Tweets, Replies, Most Liked)
- ✅ Error boundaries, toast notifications, loading states
- ✅ Tailwind theme customization (KiWi Indigo colors, custom fonts)
- ✅ Responsive mobile-first design
- ✅ Like/unlike, delete, reply, create operations with optimistic updates

**Critical Path:**

1. Dependencies (foundation) → 2. State management (Redux) → 3. API layer (MirageJS) → 4. Project restructure → 5. Core UI components → 6. Pages → 7. Advanced features → 8. Polish

---

## Complete Table of Contents

- [Session 1 – Dependency Foundation](#session-1--dependency-foundation)
- [Session 2 – Redux Store & Slices](#session-2--redux-store--slices)
- [Session 3 – Mock API & HTTP Client](#session-3--mock-api--http-client)
- [Session 4 – Project Restructure](#session-4--project-restructure)
- [Session 5 – Timeline & Feed UI](#session-5--timeline--feed-ui)
- [Session 6 – Replies & Detail View](#session-6--replies--detail-view)
- [Session 7 – Profile Page & Ownership](#session-7--profile-page--ownership)
- [Session 8 – Auth UX & Branding](#session-8--auth-ux--branding)
- [Session 9 – Error Handling & Polish](#session-9--error-handling--polish)
- [Session 10 – Tweet Naming Alignment](#session-10--tweet-naming-alignment)
- [Session 11 – Advanced Components](#session-11--advanced-components)
- [Session 12 – Documentation & Finalization](#session-12--documentation--finalization)
- [Complete Change Coverage](#complete-change-coverage-baseline-vs-current)

---

## Session 1 – Dependency Foundation

**Goal:**
Establish the dependency foundation required for state management, API mocking, authentication, and enhanced UI/UX.

**Key Changes:**

- Added 8 runtime dependencies (Redux Toolkit, React Redux, MirageJS, JWT Decode, React Toastify, Day.js, Bootstrap Icons, PropTypes)
- Kept existing Vite/React/React Router versions
- Introduced npm lockfile alongside yarn.lock

**Files/Areas Touched:**

- `package.json` – Added dependencies:
  - `@reduxjs/toolkit@^2.11.2`
  - `react-redux@^9.2.0`
  - `miragejs@^0.1.48`
  - `jwt-decode@^4.0.0`
  - `react-toastify@^11.0.5`
  - `dayjs@^1.11.19`
  - `bootstrap-icons@^1.13.1`
  - `prop-types@^15.8.1`
  - (Already present: axios, react-hook-form, query-string)
- `package-lock.json` – New npm lockfile

**Result:**
App now has complete dependency surface for Redux state, mock API, JWT auth, notifications, date handling, and icons.

**Notes / follow-ups:**

- Repo contains both `package-lock.json` and `yarn.lock`; consider standardizing to single package manager
- No code changes yet; purely dependency setup

---

## Session 2 – Redux Store & Slices

**Goal:**
Introduce centralized state management for tweets and authentication, foundational for all subsequent features.

**Key Changes:**

- Created Redux Toolkit store with combineReducers pattern
- Implemented `tweetsSlice.js` with:
  - Initial state: `{ tweets: [] }`
  - Reducers: `loadTweets`, `addTweet`, `likeTweet`, `unlikeTweet`, `deleteTweet`, `replyToTweet`
  - Selectors: `selectTweets(mode)`, `selectTweetsByUsername(username)`
  - Recursive helpers for nested tweet operations
- Implemented `userSlice.js` with:
  - Initial state: `{ token: null, user: null }`
  - Reducers: `login(token)`, `logout()`
  - JWT token decoding via `jwtDecode`
  - Selector: `selectUser(state)`
- Integrated Redux Provider in main.jsx

**Files/Areas Touched:**

- Created: `src/redux/store.js`, `src/redux/tweetsSlice.js`, `src/redux/userSlice.js`
- Modified: `src/main.jsx` (added Provider wrapper)

**Result:**
Global state is centralized and predictable; all pages/components can now subscribe to tweet and user state via hooks.

**Notes / follow-ups:**

- Tweet structure supports nested replies: `{ id, authorId, username, name, content, createDate, likes, likedByUser, replies: [...] }`
- Selectors flatten nested replies for different timeline modes
- User selector provides decoded JWT payload: `{ sub, name, nickname, iat }`

---

## Session 3 – Mock API & HTTP Client

**Goal:**
Enable end-to-end UI testing without a real backend; create stable HTTP layer with auth support.

**Key Changes:**

- Created comprehensive MirageJS server (425+ lines, src/utils/devserver.js) with:
  - POST /login – User authentication, JWT-like token generation
  - POST /signup – New user registration, adds to in-memory users array
  - GET /tweets – Fetch all tweets (with likedByUser tracking if authenticated)
  - POST /tweets – Create new tweet (requires auth)
  - DELETE /tweets/:id – Delete tweet (owner-only via token)
  - POST /tweets/:id/like – Like a tweet (requires auth)
  - DELETE /tweets/:id/like – Unlike a tweet (requires auth)
  - POST /tweets/:id/replies – Reply to a tweet (requires auth)
  - GET /users/me – Get current user info (requires auth)
  - GET /users/:username – Get user profile (optional auth)
  - Mock data: 100 pre-generated tweets with 3 nested replies each, 10 sample users
- Created axios HTTP client (`src/utils/axios.js`) with:
  - Base URL: `https://uppro-0825.workintech.com.tr/`
  - `setToken(token)` – Sets Authorization header
  - `removeToken()` – Clears Authorization header
  - Response interceptor: 401 status triggers `removeAuthToken()`
- Created auth helpers (`src/utils/auth.js`):
  - `setAuthToken(token)` – Stores token in localStorage + axios
  - `getAuthToken()` – Retrieves token from localStorage
  - `removeAuthToken()` – Clears token from localStorage + axios
- Token decoding helper supports both JWT format and base64 fallback

**Files/Areas Touched:**

- Created: `src/utils/devserver.js`, `src/utils/axios.js`, `src/utils/auth.js`
- Modified: `src/App.jsx` (imported devserver.js for MirageJS initialization)

**Result:**
App can authenticate, create/read/update/delete tweets, like/unlike, reply, and persist sessions—all in-browser with mock data. No backend server required.

**Notes / follow-ups:**

- Mock server uses `window.crypto.randomUUID()` for tweet IDs
- Token payload includes sub (user ID), name, nickname, iat (issued at)
- Like tracking stored server-side in `tweetsLikedByUser` object (per-user arrays)
- Mock data generated with Turkish names/content for flavor

---

## Session 4 – Project Restructure

**Goal:**
Convert flat root-level pages into modular, scalable architecture with clear separation of concerns.

**Key Changes:**

- Created `src/pages/` folder with route-level components:
  - `Home.jsx` – Main feed with tweet creation, mode switching, Redux integration
  - `Detail.jsx` – Tweet detail/thread view, recursive tweet lookup, reply rendering
  - `Profile.jsx` – User profile with tabs (Tweets/Likes/Replies)
  - `Login.jsx` – Login form page (in addition to modal)
  - `Signup.jsx` – Registration form page
- Created `src/layouts/` folder with reusable wrappers:
  - `AuthLayout.jsx` – Wrapper for login/signup pages (centered, card styling)
  - `PageLayout.jsx` – Wrapper for authenticated pages (header + main container)
- Removed baseline root-level pages: `src/Login.jsx`, `src/Signup.jsx`, `src/PageLayout.jsx`, `src/AuthLayout.jsx`
- Updated `src/App.jsx` routing to point to new pages
- Updated imports across all pages

**Files/Areas Touched:**

- Created: `src/pages/Home.jsx`, `src/pages/Detail.jsx`, `src/pages/Profile.jsx`, `src/pages/Login.jsx`, `src/pages/Signup.jsx`
- Created: `src/layouts/AuthLayout.jsx`, `src/layouts/PageLayout.jsx`
- Removed: `src/Login.jsx`, `src/Signup.jsx`, `src/PageLayout.jsx`, `src/AuthLayout.jsx`
- Modified: `src/App.jsx` (routing updated)

**Result:**
Codebase is now organized by responsibility (pages handle routes, layouts wrap UX, components are reusable). Easier to scale and maintain.

**Notes / follow-ups:**

- Pages now integrate Redux hooks (useDispatch, useSelector) for state management
- Routing structure: /login, /signup, /, /profile/:username, /detail/:tweetId
- Lazy loading added in App.jsx for pages to improve initial load

---

## Session 5 – Timeline & Feed UI

**Goal:**
Build core feed functionality: displaying tweets, creating tweets, switching timeline modes.

**Key Changes:**

- Created `Timeline.jsx` component:
  - Displays array of tweets with Post sub-components
  - Loading state ("Yükleniyor...")
  - Empty state ("Bu kullanıcının tweet'leri yok")
  - PropTypes validation
- Created `PostEditor.jsx` component:
  - Tweet/reply composer textarea (max 160 chars)
  - Real-time character counter
  - Submit button with loading state
  - Form validation (empty tweet rejection)
  - Toast notifications (success/error)
- Created `TimelineSelector.jsx` component:
  - 4 mode tabs: Timeline, Tweetler (Tweets), Yanıtlar (Replies), En Beğenilenler (Most Liked)
  - Active state styling, hover effects
  - Accessible (role="tab", aria-selected)
- Created `Post.jsx` component (detailed in Session 6)
- Enhanced styling:
  - `tailwind.config.js` – Added custom colors (primary #121054, accent #1a1670, dark #0a0830) and font families (Kite One, Domine, Nunito)
  - `src/App.css` – Component-level styles
  - `src/index.css` – Global styles, animations (fadeIn), custom keyframes
- Updated `Home.jsx` to integrate Timeline, PostEditor, TimelineSelector, and Redux hooks

**Files/Areas Touched:**

- Created: `src/components/Timeline.jsx`, `src/components/PostEditor.jsx`, `src/components/TimelineSelector.jsx`, `src/components/Post.jsx`
- Modified: `src/pages/Home.jsx`, `tailwind.config.js`, `src/App.css`, `src/index.css`

**Result:**
Users can browse tweets, switch between timeline modes, create new tweets, and see character counter and validation feedback.

**Notes / follow-ups:**

- Most Liked mode filters by like count and date (last 24h) via Redux selector
- PostEditor supports both tweet and reply modes (isReply prop)
- Animations: fade-in on replies, character counter color change when near limit

---

## Session 6 – Replies & Detail View

**Goal:**
Implement nested conversation system: replies to tweets, detail pages showing threads, recursive tweet handling.

**Key Changes:**

- Enhanced `Post.jsx` component:
  - Like/unlike buttons with optimistic updates
  - Delete button (owner-only, gated by isPostOwner)
  - Menu toggle for actions
  - Reply visibility toggle
  - Conditional styling for replies vs root tweets
  - Relative timestamps (Day.js)
- Created `Replies.jsx` component:
  - Displays array of replies for a parent tweet
  - Staggered fade-in animations (50ms delays)
  - Reply counter badge
  - PostEditor embedded for adding new replies
  - Empty state ("Henüz yanıt yok")
  - Newest-first sorting
- Created `ReplyEditor.jsx` component:
  - Wrapper around PostEditor with isReply=true
  - Integrates with Replies component
- Implemented `Detail.jsx` page:
  - Fetches single tweet by ID from URL param
  - Handles nested replies (recursive lookup)
  - Renders parent tweet + all replies in Replies component
  - Builds thread context (parent, siblings, current tweet)
  - Error handling for missing tweets
- Enhanced `tweetsSlice.js`:
  - `replyToTweet` reducer appends reply to parent's replies array
  - Recursive helpers: `findTweetById`, `findTweetByIdRecursive`

**Files/Areas Touched:**

- Created: `src/components/Replies.jsx`, `src/components/ReplyEditor.jsx`, `src/pages/Detail.jsx`
- Modified: `src/components/Post.jsx`, `src/redux/tweetsSlice.js`

**Result:**
Users can reply to tweets, view replies in detail pages, and navigate nested conversations. Recursive data structures support arbitrary nesting.

**Notes / follow-ups:**

- isPostOwner() utility guards delete action (compares decoded token sub with tweet authorId)
- Replies sorted newest-first: `[...replies].sort((a, b) => b.createDate - a.createDate)`
- Detail page displays "Yükleniyor..." during fetch; handles missing tweets gracefully

---

## Session 7 – Profile Page & Ownership

**Goal:**
Display user profiles with tab-based content filtering; implement ownership-based authorization.

**Key Changes:**

- Implemented `Profile.jsx` page:
  - Route: `/profile/:username`
  - Fetches user info from `/users/:username` API endpoint
  - Integrates Redux selectors to get user's tweets, likes, replies
  - Tab navigation: Tweets (tweetler), Likes (beğeniler), Replies (yanıtlar)
  - Content display based on active tab
  - Shows composer if viewing own profile
  - User avatar (Gravatar style via `i.pravatar.cc`)
  - Detects current user via Redux user state
- Created `ownership.js` utility:
  - `isPostOwner(currentUser, post)` function
  - Checks decoded token `sub` vs tweet `authorId`
  - Fallback: checks `nickname` vs `username`
  - Returns boolean for gating delete/edit actions

**Files/Areas Touched:**

- Created: `src/pages/Profile.jsx`, `src/utils/ownership.js`
- Modified: `src/components/Post.jsx` (uses isPostOwner for delete visibility)

**Result:**
Users can view their own profile and others' profiles with tabbed content filtering. Only owners can delete their own tweets.

**Notes / follow-ups:**

- selectTweetsByUsername(username) selector filters root tweets by username
- Profile shows user metadata (name, avatar) fetched from mock API
- Ownership check prevents unauthorized deletions

---

## Session 8 – Auth UX & Branding

**Goal:**
Improve authentication UX with in-context login modal; add consistent branding and visual identity.

**Key Changes:**

- Created `Header.jsx` component:
  - Logo + app name (kiwitter)
  - Responsive nav: desktop full width, mobile stacked
  - Conditional links based on auth state:
    - If logged in: profile link + logout button
    - If logged out: login button (opens modal) + signup link
  - User avatar when logged in
  - Hover effects and transitions
- Created `LoginModal.jsx` component:
  - Modal dialog with backdrop
  - Form with nickname and password fields
  - Real-time validation via React Hook Form
  - Error display below each field
  - Keyboard accessibility (Escape to close, Tab trapping)
  - Animations (fade-in, scale-in)
  - Submitting state (button text changes)
  - Toast feedback (success/error)
- Created SVG icon assets:
  - `src/icon/logo-light.svg` – Light variant for Header
  - `src/icon/logo-dark.svg` – Dark variant for AuthLayout
  - Raven icon SVG variants (Material Design icons)
- Updated `AuthLayout.jsx`:
  - Centered card design
  - Logo display
  - Responsive spacing
- Updated `PageLayout.jsx`:
  - Integrated Header component at top
  - Sticky header with shadow
  - Main content area

**Files/Areas Touched:**

- Created: `src/components/Header.jsx`, `src/components/LoginModal.jsx`, `src/icon/logo-*.svg`, `src/icon/raven_*.svg`
- Modified: `src/layouts/AuthLayout.jsx`, `src/layouts/PageLayout.jsx`, `src/pages/Login.jsx`, `src/pages/Signup.jsx`

**Result:**
App has consistent branding across all pages. Users can login in-context via modal without leaving current page. Improved UX with clear auth state.

**Notes / follow-ups:**

- Modal uses react-hook-form for validation, integrates with Redux login action
- Header detects auth state via Redux and renders conditionally
- Logo variants allow dark/light theme support

---

## Session 9 – Error Handling & Polish

**Goal:**
Improve app stability, error recovery, and perceived quality with error boundaries, session persistence, and consistent feedback.

**Key Changes:**

- Created `ErrorBoundary.jsx` component:
  - Class component that catches React errors
  - Displays error UI with message and reload button
  - Logs error to console for debugging
  - Prevents white-screen-of-death crashes
- Enhanced `App.jsx`:
  - Wrapped root routing in ErrorBoundary
  - Added initial loading state during auth session restoration
  - useEffect hook restores auth token from localStorage on mount
  - Sets axios default auth header if token exists
  - Dispatch login action to restore Redux user state
  - Shows loading spinner while restoring session
  - Lazy load page components for code splitting
- Enhanced `main.jsx`:
  - Added Provider (Redux) and ErrorBoundary providers
  - Added ToastContainer from react-toastify for global notifications
- Integrated toast notifications throughout:
  - Success: "Tweet gönderildi", "Giriş başarılı", etc.
  - Error: "Bir hata oluştu", "Tweet gönderilemedi", etc.

**Files/Areas Touched:**

- Created: `src/components/ErrorBoundary.jsx`
- Modified: `src/App.jsx`, `src/main.jsx`, all pages/components (added toast calls)

**Result:**
App gracefully handles errors, restores sessions on page reload, and provides consistent user feedback via toasts.

**Notes / follow-ups:**

- ErrorBoundary catches render-time errors but not async errors (those use toasts)
- Session restoration happens transparently on app startup
- Axios interceptor handles 401 responses (logout + removeAuthToken)

---

## Session 10 – Tweet Naming Alignment

**Goal:**
Standardize "tweet" naming across codebase; provide backward compatibility for "twit" legacy imports.

**Key Changes:**

- Renamed primary slice from `twitsSlice.js` to `tweetsSlice.js` throughout codebase
- Updated all imports: `import { ... } from '../redux/tweetsSlice'`
- Created `twitsSlice.js` as compatibility re-export:
  - Imports all from tweetsSlice
  - Re-exports with same names
  - Allows old "twits" imports to keep working
- Updated Redux store to use tweetsSlice
- Standardized terminology: "tweet" vs "twit" throughout components and pages

**Files/Areas Touched:**

- Renamed: `src/redux/twitsSlice.js` → used for re-export from `tweetsSlice.js`
- Modified: All pages and components that imported tweets actions/selectors
- Modified: `src/redux/store.js`, `src/utils/devserver.js`

**Result:**
Codebase consistently uses "tweet" terminology while tolerating old "twit" imports for backward compatibility.

**Notes / follow-ups:**

- If migration is complete, twitsSlice.js can be removed in future cleanup
- All current code uses tweetsSlice import path

---

## Session 11 – Advanced Components

**Goal:**
Finalize component library with remaining UI features and polish.

**Key Changes:**

- Enhanced `Post.jsx`:
  - Added like/unlike with heart icon
  - Added delete button with confirmation
  - Added menu toggle for actions
  - Implemented reply toggle (expands/collapses Replies component)
  - Conditional styling for replies vs root tweets
  - Owner-only delete action gating
  - Relative timestamps via Day.js plugin
- Finalized `PostEditor.jsx`:
  - 160 character limit with validation
  - Character counter changes color when near limit (< 20 chars remaining)
  - Disabled state for submit button when empty
  - Submit loading state shows "Gönderiliyor..."
  - Reply variant styling (isReply prop)
- Finalized `Replies.jsx`:
  - Staggered fade-in animation (50ms per reply)
  - Reply counter badge in header
  - Owner badge styling (different color for user's own replies)
  - Empty state messaging
  - Gradient background styling
- Created `useLogin.js` hook:
  - Handles login flow: axios call → token decode → Redux dispatch → axios header set
  - Returns promise for error handling in components

**Files/Areas Touched:**

- Enhanced: `src/components/Post.jsx`, `src/components/PostEditor.jsx`, `src/components/Replies.jsx`
- Created: `src/hooks/useLogin.js`
- Modified: `src/pages/Login.jsx` (uses useLogin hook)

**Result:**
Complete working feature set: like, delete, reply, create all work with optimistic updates and proper feedback.

**Notes / follow-ups:**

- All API calls use axios from utils
- Redux dispatch happens immediately (optimistic)
- Failed API calls logged via toast errors
- useLogin centralizes auth flow logic

---

## Session 12 – Documentation & Finalization

**Goal:**
Finalize codebase with comprehensive documentation and configuration cleanup.

**Key Changes:**

- Updated README.md with complete feature documentation, tech stack, setup instructions, troubleshooting
- Ensured all config files properly set:
  - `vite.config.js` – Port 5176
  - `tailwind.config.js` – Custom theme colors and fonts
  - `postcss.config.js` – Tailwind processing
  - `eslint.config.js` – React best practices
  - `index.html` – App root, fonts import
- Verified dev server startup: `npm run dev` launches on http://localhost:5176
- Cleaned up unused assets (removed `src/assets/react.svg` from baseline)
- Finalized package.json with all dependencies and scripts

**Files/Areas Touched:**

- Modified: `README.md`, `vite.config.js`, `tailwind.config.js`, `postcss.config.js`, `eslint.config.js`, `index.html`, `package.json`
- Removed: `src/assets/react.svg`

**Result:**
Complete, documented, ready-to-ship Twitter clone with clear instructions for setup and development.

**Notes / follow-ups:**

- All features implemented and tested
- Mock server provides stable API layer
- Redux state management fully functional
- UI/UX polished with animations and feedback

---

## Session 12 – Documentation & Finalization

**Goal:**
Finalize codebase with comprehensive documentation and configuration cleanup.

**Key Changes:**

- Created Redux Toolkit store with combineReducers pattern
- Implemented `tweetsSlice.js` with:
  - Initial state: `{ tweets: [] }`
  - Reducers: `loadTweets`, `addTweet`, `likeTweet`, `unlikeTweet`, `deleteTweet`, `replyToTweet`
  - Selectors: `selectTweets(mode)`, `selectTweetsByUsername(username)`
  - Recursive helpers for nested tweet operations
- Implemented `userSlice.js` with:
  - Initial state: `{ token: null, user: null }`
  - Reducers: `login(token)`, `logout()`
  - JWT token decoding via `jwtDecode`
  - Selector: `selectUser(state)`
- Integrated Redux Provider in main.jsx

**Files/Areas Touched:**

- Created: `src/redux/store.js`, `src/redux/tweetsSlice.js`, `src/redux/userSlice.js`
- Modified: `src/main.jsx` (added Provider wrapper)

**Result:**
Global state is centralized and predictable; all pages/components can now subscribe to tweet and user state via hooks.

**Notes / follow-ups:**

- Tweet structure supports nested replies: `{ id, authorId, username, name, content, createDate, likes, likedByUser, replies: [...] }`
- Selectors flatten nested replies for different timeline modes
- User selector provides decoded JWT payload: `{ sub, name, nickname, iat }`

---

## Session 3 – Mock API & HTTP Client

**Goal:**
Enable end-to-end UI testing without a real backend; create stable HTTP layer with auth support.

**Key Changes:**

- Created comprehensive MirageJS server (425+ lines, src/utils/devserver.js) with:
  - POST /login – User authentication, JWT-like token generation
  - POST /signup – New user registration, adds to in-memory users array
  - GET /tweets – Fetch all tweets (with likedByUser tracking if authenticated)
  - POST /tweets – Create new tweet (requires auth)
  - DELETE /tweets/:id – Delete tweet (owner-only via token)
  - POST /tweets/:id/like – Like a tweet (requires auth)
  - DELETE /tweets/:id/like – Unlike a tweet (requires auth)
  - POST /tweets/:id/replies – Reply to a tweet (requires auth)
  - GET /users/me – Get current user info (requires auth)
  - GET /users/:username – Get user profile (optional auth)
  - Mock data: 100 pre-generated tweets with 3 nested replies each, 10 sample users
- Created axios HTTP client (`src/utils/axios.js`) with:
  - Base URL: `https://uppro-0825.workintech.com.tr/`
  - `setToken(token)` – Sets Authorization header
  - `removeToken()` – Clears Authorization header
  - Response interceptor: 401 status triggers `removeAuthToken()`
- Created auth helpers (`src/utils/auth.js`):
  - `setAuthToken(token)` – Stores token in localStorage + axios
  - `getAuthToken()` – Retrieves token from localStorage
  - `removeAuthToken()` – Clears token from localStorage + axios
- Token decoding helper supports both JWT format and base64 fallback

**Files/Areas Touched:**

- Created: `src/utils/devserver.js`, `src/utils/axios.js`, `src/utils/auth.js`
- Modified: `src/App.jsx` (imported devserver.js for MirageJS initialization)

**Result:**
App can authenticate, create/read/update/delete tweets, like/unlike, reply, and persist sessions—all in-browser with mock data. No backend server required.

**Notes / follow-ups:**

- Mock server uses `window.crypto.randomUUID()` for tweet IDs
- Token payload includes sub (user ID), name, nickname, iat (issued at)
- Like tracking stored server-side in `tweetsLikedByUser` object (per-user arrays)
- Mock data generated with Turkish names/content for flavor

---

## Session 4 – Project Restructure

**Goal:**
Convert flat root-level pages into modular, scalable architecture with clear separation of concerns.

**Key Changes:**

- Created `src/pages/` folder with route-level components:
  - `Home.jsx` – Main feed with tweet creation, mode switching, Redux integration
  - `Detail.jsx` – Tweet detail/thread view, recursive tweet lookup, reply rendering
  - `Profile.jsx` – User profile with tabs (Tweets/Likes/Replies)
  - `Login.jsx` – Login form page (in addition to modal)
  - `Signup.jsx` – Registration form page
- Created `src/layouts/` folder with reusable wrappers:
  - `AuthLayout.jsx` – Wrapper for login/signup pages (centered, card styling)
  - `PageLayout.jsx` – Wrapper for authenticated pages (header + main container)
- Removed baseline root-level pages: `src/Login.jsx`, `src/Signup.jsx`, `src/PageLayout.jsx`, `src/AuthLayout.jsx`
- Updated `src/App.jsx` routing to point to new pages
- Updated imports across all pages

**Files/Areas Touched:**

- Created: `src/pages/Home.jsx`, `src/pages/Detail.jsx`, `src/pages/Profile.jsx`, `src/pages/Login.jsx`, `src/pages/Signup.jsx`
- Created: `src/layouts/AuthLayout.jsx`, `src/layouts/PageLayout.jsx`
- Removed: `src/Login.jsx`, `src/Signup.jsx`, `src/PageLayout.jsx`, `src/AuthLayout.jsx`
- Modified: `src/App.jsx` (routing updated)

**Result:**
Codebase is now organized by responsibility (pages handle routes, layouts wrap UX, components are reusable). Easier to scale and maintain.

**Notes / follow-ups:**

- Pages now integrate Redux hooks (useDispatch, useSelector) for state management
- Routing structure: /login, /signup, /, /profile/:username, /detail/:tweetId
- Lazy loading added in App.jsx for pages to improve initial load

---

## Session 5 – Timeline & Feed UI

**Goal:**
Build core feed functionality: displaying tweets, creating tweets, switching timeline modes.

**Key Changes:**

- Created `Timeline.jsx` component:
  - Displays array of tweets with Post sub-components
  - Loading state ("Yükleniyor...")
  - Empty state ("Bu kullanıcının tweet'leri yok")
  - PropTypes validation
- Created `PostEditor.jsx` component:
  - Tweet/reply composer textarea (max 160 chars)
  - Real-time character counter
  - Submit button with loading state
  - Form validation (empty tweet rejection)
  - Toast notifications (success/error)
- Created `TimelineSelector.jsx` component:
  - 4 mode tabs: Timeline, Tweetler (Tweets), Yanıtlar (Replies), En Beğenilenler (Most Liked)
  - Active state styling, hover effects
  - Accessible (role="tab", aria-selected)
- Created `Post.jsx` component (detailed in Session 6)
- Enhanced styling:
  - `tailwind.config.js` – Added custom colors (primary #121054, accent #1a1670, dark #0a0830) and font families (Kite One, Domine, Nunito)
  - `src/App.css` – Component-level styles
  - `src/index.css` – Global styles, animations (fadeIn), custom keyframes
- Updated `Home.jsx` to integrate Timeline, PostEditor, TimelineSelector, and Redux hooks

**Files/Areas Touched:**

- Created: `src/components/Timeline.jsx`, `src/components/PostEditor.jsx`, `src/components/TimelineSelector.jsx`, `src/components/Post.jsx`
- Modified: `src/pages/Home.jsx`, `tailwind.config.js`, `src/App.css`, `src/index.css`

**Result:**
Users can browse tweets, switch between timeline modes, create new tweets, and see character counter and validation feedback.

**Notes / follow-ups**:

- Most Liked mode filters by like count and date (last 24h) via Redux selector
- PostEditor supports both tweet and reply modes (isReply prop)
- Animations: fade-in on replies, character counter color change when near limit

---

## Session 6 – Replies & Detail View

**Goal:**
Implement nested conversation system: replies to tweets, detail pages showing threads, recursive tweet handling.

**Key Changes:**

- Enhanced `Post.jsx` component:
  - Like/unlike buttons with optimistic updates
  - Delete button (owner-only, gated by isPostOwner)
  - Menu toggle for actions
  - Reply visibility toggle
  - Conditional styling for replies vs root tweets
  - Relative timestamps (Day.js)
- Created `Replies.jsx` component:
  - Displays array of replies for a parent tweet
  - Staggered fade-in animations (50ms delays)
  - Reply counter badge
  - PostEditor embedded for adding new replies
  - Empty state ("Henüz yanıt yok")
  - Newest-first sorting
- Created `ReplyEditor.jsx` component:
  - Wrapper around PostEditor with isReply=true
  - Integrates with Replies component
- Implemented `Detail.jsx` page:
  - Fetches single tweet by ID from URL param
  - Handles nested replies (recursive lookup)
  - Renders parent tweet + all replies in Replies component
  - Builds thread context (parent, siblings, current tweet)
  - Error handling for missing tweets
- Enhanced `tweetsSlice.js`:
  - `replyToTweet` reducer appends reply to parent's replies array
  - Recursive helpers: `findTweetById`, `findTweetByIdRecursive`

**Files/Areas Touched:**

- Created: `src/components/Replies.jsx`, `src/components/ReplyEditor.jsx`, `src/pages/Detail.jsx`
- Modified: `src/components/Post.jsx`, `src/redux/tweetsSlice.js`

**Result:**
Users can reply to tweets, view replies in detail pages, and navigate nested conversations. Recursive data structures support arbitrary nesting.

**Notes / follow-ups**:

- isPostOwner() utility guards delete action (compares decoded token sub with tweet authorId)
- Replies sorted newest-first: `[...replies].sort((a, b) => b.createDate - a.createDate)`
- Detail page displays "Yükleniyor..." during fetch; handles missing tweets gracefully

---

## Session 7 – Profile Page & Ownership

**Goal:**
Display user profiles with tab-based content filtering; implement ownership-based authorization.

**Key Changes:**

- Implemented `Profile.jsx` page:
  - Route: `/profile/:username`
  - Fetches user info from `/users/:username` API endpoint
  - Integrates Redux selectors to get user's tweets, likes, replies
  - Tab navigation: Tweets (tweetler), Likes (beğeniler), Replies (yanıtlar)
  - Content display based on active tab
  - Shows composer if viewing own profile
  - User avatar (Gravatar style via `i.pravatar.cc`)
  - Detects current user via Redux user state
- Created `ownership.js` utility:
  - `isPostOwner(currentUser, post)` function
  - Checks decoded token `sub` vs tweet `authorId`
  - Fallback: checks `nickname` vs `username`
  - Returns boolean for gating delete/edit actions

**Files/Areas Touched:**

- Created: `src/pages/Profile.jsx`, `src/utils/ownership.js`
- Modified: `src/components/Post.jsx` (uses isPostOwner for delete visibility)

**Result:**
Users can view their own profile and others' profiles with tabbed content filtering. Only owners can delete their own tweets.

**Notes / follow-ups**:

- selectTweetsByUsername(username) selector filters root tweets by username
- Profile shows user metadata (name, avatar) fetched from mock API
- Ownership check prevents unauthorized deletions

---

## Session 8 – Auth UX & Branding

**Goal:**
Improve authentication UX with in-context login modal; add consistent branding and visual identity.

**Key Changes:**

- Created `Header.jsx` component:
  - Logo + app name (kiwitter)
  - Responsive nav: desktop full width, mobile stacked
  - Conditional links based on auth state:
    - If logged in: profile link + logout button
    - If logged out: login button (opens modal) + signup link
  - User avatar when logged in
  - Hover effects and transitions
- Created `LoginModal.jsx` component:
  - Modal dialog with backdrop
  - Form with nickname and password fields
  - Real-time validation via React Hook Form
  - Error display below each field
  - Keyboard accessibility (Escape to close, Tab trapping)
  - Animations (fade-in, scale-in)
  - Submitting state (button text changes)
  - Toast feedback (success/error)
- Created SVG icon assets:
  - `src/icon/logo-light.svg` – Light variant for Header
  - `src/icon/logo-dark.svg` – Dark variant for AuthLayout
  - Raven icon SVG variants (Material Design icons)
- Updated `AuthLayout.jsx`:
  - Centered card design
  - Logo display
  - Responsive spacing
- Updated `PageLayout.jsx`:
  - Integrated Header component at top
  - Sticky header with shadow
  - Main content area

**Files/Areas Touched:**

- Created: `src/components/Header.jsx`, `src/components/LoginModal.jsx`, `src/icon/logo-*.svg`, `src/icon/raven_*.svg`
- Modified: `src/layouts/AuthLayout.jsx`, `src/layouts/PageLayout.jsx`, `src/pages/Login.jsx`, `src/pages/Signup.jsx`

**Result:**
App has consistent branding across all pages. Users can login in-context via modal without leaving current page. Improved UX with clear auth state.

**Notes / follow-ups**:

- Modal uses react-hook-form for validation, integrates with Redux login action
- Header detects auth state via Redux and renders conditionally
- Logo variants allow dark/light theme support

---

## Session 9 – Error Handling & Polish

**Goal:**
Improve app stability, error recovery, and perceived quality with error boundaries, session persistence, and consistent feedback.

**Key Changes:**

- Created `ErrorBoundary.jsx` component:
  - Class component that catches React errors
  - Displays error UI with message and reload button
  - Logs error to console for debugging
  - Prevents white-screen-of-death crashes
- Enhanced `App.jsx`:
  - Wrapped root routing in ErrorBoundary
  - Added initial loading state during auth session restoration
  - useEffect hook restores auth token from localStorage on mount
  - Sets axios default auth header if token exists
  - Dispatch login action to restore Redux user state
  - Shows loading spinner while restoring session
  - Lazy load page components for code splitting
- Enhanced `main.jsx`:
  - Added Provider (Redux) and ErrorBoundary providers
  - Added ToastContainer from react-toastify for global notifications
- Integrated toast notifications throughout:
  - Success: "Tweet gönderildi", "Giriş başarılı", etc.
  - Error: "Bir hata oluştu", "Tweet gönderilemedi", etc.

**Files/Areas Touched:**

- Created: `src/components/ErrorBoundary.jsx`
- Modified: `src/App.jsx`, `src/main.jsx`, all pages/components (added toast calls)

**Result:**
App gracefully handles errors, restores sessions on page reload, and provides consistent user feedback via toasts.

**Notes / follow-ups**:

- ErrorBoundary catches render-time errors but not async errors (those use toasts)
- Session restoration happens transparently on app startup
- Axios interceptor handles 401 responses (logout + removeAuthToken)

---

## Session 10 – Tweet Naming Alignment

**Goal:**
Standardize "tweet" naming across codebase; provide backward compatibility for "twit" legacy imports.

**Key Changes:**

- Renamed primary slice from `twitsSlice.js` to `tweetsSlice.js` throughout codebase
- Updated all imports: `import { ... } from '../redux/tweetsSlice'`
- Created `twitsSlice.js` as compatibility re-export:
  - Imports all from tweetsSlice
  - Re-exports with same names
  - Allows old "twits" imports to keep working
- Updated Redux store to use tweetsSlice
- Standardized terminology: "tweet" vs "twit" throughout components and pages

**Files/Areas Touched:**

- Renamed: `src/redux/twitsSlice.js` → used for re-export from `tweetsSlice.js`
- Modified: All pages and components that imported tweets actions/selectors
- Modified: `src/redux/store.js`, `src/utils/devserver.js`

**Result:**
Codebase consistently uses "tweet" terminology while tolerating old "twit" imports for backward compatibility.

**Notes / follow-ups**:

- If migration is complete, twitsSlice.js can be removed in future cleanup
- All current code uses tweetsSlice import path

---

## Session 11 – Advanced Components

**Goal:**
Finalize component library with remaining UI features and polish.

**Key Changes:**

- Enhanced `Post.jsx`:
  - Added like/unlike with heart icon
  - Added delete button with confirmation
  - Added menu toggle for actions
  - Implemented reply toggle (expands/collapses Replies component)
  - Conditional styling for replies vs root tweets
  - Owner-only delete action gating
  - Relative timestamps via Day.js plugin
- Finalized `PostEditor.jsx`:
  - 160 character limit with validation
  - Character counter changes color when near limit (< 20 chars remaining)
  - Disabled state for submit button when empty
  - Submit loading state shows "Gönderiliyor..."
  - Reply variant styling (isReply prop)
- Finalized `Replies.jsx`:
  - Staggered fade-in animation (50ms per reply)
  - Reply counter badge in header
  - Owner badge styling (different color for user's own replies)
  - Empty state messaging
  - Gradient background styling
- Created `useLogin.js` hook:
  - Handles login flow: axios call → token decode → Redux dispatch → axios header set
  - Returns promise for error handling in components

**Files/Areas Touched:**

- Enhanced: `src/components/Post.jsx`, `src/components/PostEditor.jsx`, `src/components/Replies.jsx`
- Created: `src/hooks/useLogin.js`
- Modified: `src/pages/Login.jsx` (uses useLogin hook)

**Result:**
Complete working feature set: like, delete, reply, create all work with optimistic updates and proper feedback.

**Notes / follow-ups**:

- All API calls use axios from utils
- Redux dispatch happens immediately (optimistic)
- Failed API calls logged via toast errors
- useLogin centralizes auth flow logic

---

## Session 12 – Documentation & Finalization

**Goal:**
Finalize codebase with comprehensive documentation and configuration cleanup.

**Key Changes:**

- Updated README.md with complete feature documentation, tech stack, setup instructions, troubleshooting
- Ensured all config files properly set:
  - `vite.config.js` – Port 5176
  - `tailwind.config.js` – Custom theme colors and fonts
  - `postcss.config.js` – Tailwind processing
  - `eslint.config.js` – React best practices
  - `index.html` – App root, fonts import
- Verified dev server startup: `npm run dev` launches on http://localhost:5176
- Cleaned up unused assets (removed `src/assets/react.svg` from baseline)
- Finalized package.json with all dependencies and scripts

**Files/Areas Touched:**

- Modified: `README.md`, `vite.config.js`, `tailwind.config.js`, `postcss.config.js`, `eslint.config.js`, `index.html`, `package.json`
- Removed: `src/assets/react.svg`

**Result:**
Complete, documented, ready-to-ship Twitter clone with clear instructions for setup and development.

**Notes / follow-ups**:

- All features implemented and tested
- Mock server provides stable API layer
- Redux state management fully functional
- UI/UX polished with animations and feedback

---

## Complete Change Coverage (Baseline vs Current)

### Architecture & Structure

| Change         | Baseline                     | Current                               | Rationale                           |
| -------------- | ---------------------------- | ------------------------------------- | ----------------------------------- |
| Pages location | Root level (`src/Login.jsx`) | Organized folder (`src/pages/`)       | Scalability, separation of concerns |
| Layouts        | Basic wrappers               | Dedicated folder (`src/layouts/`)     | Reusable layout components          |
| Components     | None                         | 9 reusable components                 | Modular, maintainable UI            |
| Redux state    | None                         | 2 slices (tweets, user)               | Centralized, predictable state      |
| Utils          | 2 (auth helpers)             | 4 (auth, axios, devserver, ownership) | Separation of concerns              |
| Hooks          | None                         | 1 (useLogin)                          | Custom logic encapsulation          |
| Icons          | None                         | 3 SVG assets                          | Branding, visual identity           |

### Dependencies Added

| Package          | Version | Purpose                 | Session |
| ---------------- | ------- | ----------------------- | ------- |
| @reduxjs/toolkit | 2.11.2  | State management        | 1       |
| react-redux      | 9.2.0   | React/Redux integration | 1       |
| miragejs         | 0.1.48  | API mocking             | 1       |
| jwt-decode       | 4.0.0   | JWT parsing             | 1       |
| react-toastify   | 11.0.5  | Toast notifications     | 1       |
| dayjs            | 1.11.19 | Date formatting         | 1       |
| bootstrap-icons  | 1.13.1  | Icons                   | 1       |
| prop-types       | 15.8.1  | Type validation         | 1       |

### Redux State Management

| Feature     | Baseline | Current                                | Session  |
| ----------- | -------- | -------------------------------------- | -------- |
| Store       | None     | Configured with 2 slices               | 2        |
| Tweet state | None     | Full CRUD with selectors               | 2        |
| User state  | None     | Token + decoded JWT                    | 2        |
| Selectors   | None     | Timeline filtering, username filtering | 2, 5, 7  |
| Actions     | None     | 8 tweet actions, 2 user actions        | 2, 6, 10 |

### API & Mock Server

| Feature          | Baseline    | Current                                                        | Session |
| ---------------- | ----------- | -------------------------------------------------------------- | ------- |
| HTTP client      | Basic axios | Configured with auth header helpers                            | 3       |
| Token management | None        | localStorage + axios header                                    | 3       |
| Mock API         | None        | 10 endpoints, 100 tweets, 10 users                             | 3       |
| Auth endpoints   | None        | /login, /signup                                                | 3       |
| Tweet endpoints  | None        | GET/POST/DELETE /tweets, /tweets/:id/like, /tweets/:id/replies | 3       |
| User endpoints   | None        | /users/me, /users/:username                                    | 3       |

### UI Components

| Component        | Baseline    | Current                    | Session  |
| ---------------- | ----------- | -------------------------- | -------- |
| Header           | None        | Logo, nav, auth links      | 8        |
| Post/Tweet card  | None        | Like, delete, reply menu   | 5, 6, 11 |
| Timeline         | None        | Feed display, modes        | 5        |
| PostEditor       | None        | Tweet/reply composer       | 5        |
| TimelineSelector | None        | Mode tabs                  | 5        |
| Replies          | None        | Reply list with animations | 6        |
| LoginModal       | None        | Modal form                 | 8        |
| ErrorBoundary    | None        | Error fallback UI          | 9        |
| AuthLayout       | Placeholder | Refined card layout        | 4        |
| PageLayout       | Placeholder | With Header integration    | 4        |

### Pages

| Page    | Baseline         | Current                         | Session |
| ------- | ---------------- | ------------------------------- | ------- |
| Home    | Placeholder      | Functional timeline with editor | 4, 5    |
| Detail  | None             | Thread/detail view              | 6       |
| Profile | Placeholder text | Functional with tabs            | 7       |
| Login   | Basic form       | Enhanced with modal + page      | 4, 8    |
| Signup  | Basic form       | Enhanced with registration      | 4       |

### Styling & Theme

| Feature    | Baseline | Current                                      | Session |
| ---------- | -------- | -------------------------------------------- | ------- |
| Colors     | Basic    | KiWi Indigo theme (primary, accent, dark)    | 5       |
| Fonts      | Default  | 3 custom families (Kite One, Domine, Nunito) | 5       |
| Animations | None     | fadeIn, scale-in, transitions                | 5, 9    |
| Responsive | Basic    | Mobile-first Tailwind                        | 5       |
| Dark theme | None     | Primary #121054, accent #1a1670              | 5       |

### Authentication & Authorization

| Feature             | Baseline  | Current                        | Session |
| ------------------- | --------- | ------------------------------ | ------- |
| Login               | Form only | Form + modal + session restore | 8, 9    |
| Token storage       | None      | localStorage + axios header    | 3, 9    |
| Session persistence | None      | Restore on page reload         | 9       |
| Ownership checks    | None      | isPostOwner() utility          | 7       |
| JWT decoding        | None      | Via jwt-decode library         | 2, 3    |

### UX Features

| Feature             | Baseline | Current                  | Session |
| ------------------- | -------- | ------------------------ | ------- |
| Loading states      | None     | "Yükleniyor..." spinners | 5, 7    |
| Empty states        | None     | Friendly messaging       | 5       |
| Toast notifications | None     | Success/error feedback   | 9       |
| Character counter   | None     | Real-time, color-coded   | 5       |
| Relative timestamps | None     | "2 hours ago" via Day.js | 6       |
| Error boundaries    | None     | Graceful error handling  | 9       |
| Optimistic updates  | None     | Like/unlike immediate    | 6, 11   |

### File Count Summary

| Category                     | Baseline | Current | Change  |
| ---------------------------- | -------- | ------- | ------- |
| Pages                        | 3        | 5       | +2      |
| Components                   | 0        | 9       | +9      |
| Layouts                      | 1        | 2       | +1      |
| Redux slices                 | 0        | 3       | +3      |
| Utils                        | 0        | 4       | +4      |
| Hooks                        | 0        | 1       | +1      |
| Icons                        | 0        | 3       | +3      |
| CSS files                    | 2        | 2       | 0       |
| **Total new .jsx/.js files** | ~6       | ~30     | **+24** |

---

## Validation Against Baseline

This sessions log has been validated against actual code inspection:

- ✅ All new files confirmed to exist in current project
- ✅ All deleted files confirmed missing from current project
- ✅ All Redux actions/reducers confirmed implemented
- ✅ All API endpoints confirmed in devserver.js
- ✅ All component features confirmed implemented
- ✅ Dependencies confirmed in package.json
- ✅ No features documented that don't exist in code
- ✅ All sessions logically ordered by dependency

| Change         | Baseline                     | Current                               | Rationale                           |
| -------------- | ---------------------------- | ------------------------------------- | ----------------------------------- |
| Pages location | Root level (`src/Login.jsx`) | Organized folder (`src/pages/`)       | Scalability, separation of concerns |
| Layouts        | Basic wrappers               | Dedicated folder (`src/layouts/`)     | Reusable layout components          |
| Components     | None                         | 9 reusable components                 | Modular, maintainable UI            |
| Redux state    | None                         | 2 slices (tweets, user)               | Centralized, predictable state      |
| Utils          | 2 (auth helpers)             | 4 (auth, axios, devserver, ownership) | Separation of concerns              |
| Hooks          | None                         | 1 (useLogin)                          | Custom logic encapsulation          |
| Icons          | None                         | 3 SVG assets                          | Branding, visual identity           |

### Dependencies Added

| Package          | Version | Purpose                 | Session |
| ---------------- | ------- | ----------------------- | ------- |
| @reduxjs/toolkit | 2.11.2  | State management        | 1       |
| react-redux      | 9.2.0   | React/Redux integration | 1       |
| miragejs         | 0.1.48  | API mocking             | 1       |
| jwt-decode       | 4.0.0   | JWT parsing             | 1       |
| react-toastify   | 11.0.5  | Toast notifications     | 1       |
| dayjs            | 1.11.19 | Date formatting         | 1       |
| bootstrap-icons  | 1.13.1  | Icons                   | 1       |
| prop-types       | 15.8.1  | Type validation         | 1       |

### Redux State Management

| Feature     | Baseline | Current                                | Session  |
| ----------- | -------- | -------------------------------------- | -------- |
| Store       | None     | Configured with 2 slices               | 2        |
| Tweet state | None     | Full CRUD with selectors               | 2        |
| User state  | None     | Token + decoded JWT                    | 2        |
| Selectors   | None     | Timeline filtering, username filtering | 2, 5, 7  |
| Actions     | None     | 8 tweet actions, 2 user actions        | 2, 6, 10 |

### API & Mock Server

| Feature          | Baseline    | Current                                                        | Session |
| ---------------- | ----------- | -------------------------------------------------------------- | ------- |
| HTTP client      | Basic axios | Configured with auth header helpers                            | 3       |
| Token management | None        | localStorage + axios header                                    | 3       |
| Mock API         | None        | 10 endpoints, 100 tweets, 10 users                             | 3       |
| Auth endpoints   | None        | /login, /signup                                                | 3       |
| Tweet endpoints  | None        | GET/POST/DELETE /tweets, /tweets/:id/like, /tweets/:id/replies | 3       |
| User endpoints   | None        | /users/me, /users/:username                                    | 3       |

### UI Components

| Component        | Baseline    | Current                    | Session  |
| ---------------- | ----------- | -------------------------- | -------- |
| Header           | None        | Logo, nav, auth links      | 8        |
| Post/Tweet card  | None        | Like, delete, reply menu   | 5, 6, 11 |
| Timeline         | None        | Feed display, modes        | 5        |
| PostEditor       | None        | Tweet/reply composer       | 5        |
| TimelineSelector | None        | Mode tabs                  | 5        |
| Replies          | None        | Reply list with animations | 6        |
| LoginModal       | None        | Modal form                 | 8        |
| ErrorBoundary    | None        | Error fallback UI          | 9        |
| AuthLayout       | Placeholder | Refined card layout        | 4        |
| PageLayout       | Placeholder | With Header integration    | 4        |

### Pages

| Page    | Baseline         | Current                         | Session |
| ------- | ---------------- | ------------------------------- | ------- |
| Home    | Placeholder      | Functional timeline with editor | 4, 5    |
| Detail  | None             | Thread/detail view              | 6       |
| Profile | Placeholder text | Functional with tabs            | 7       |
| Login   | Basic form       | Enhanced with modal + page      | 4, 8    |
| Signup  | Basic form       | Enhanced with registration      | 4       |

### Styling & Theme

| Feature    | Baseline | Current                                      | Session |
| ---------- | -------- | -------------------------------------------- | ------- |
| Colors     | Basic    | KiWi Indigo theme (primary, accent, dark)    | 5       |
| Fonts      | Default  | 3 custom families (Kite One, Domine, Nunito) | 5       |
| Animations | None     | fadeIn, scale-in, transitions                | 5, 9    |
| Responsive | Basic    | Mobile-first Tailwind                        | 5       |
| Dark theme | None     | Primary #121054, accent #1a1670              | 5       |

### Authentication & Authorization

| Feature             | Baseline  | Current                        | Session |
| ------------------- | --------- | ------------------------------ | ------- |
| Login               | Form only | Form + modal + session restore | 8, 9    |
| Token storage       | None      | localStorage + axios header    | 3, 9    |
| Session persistence | None      | Restore on page reload         | 9       |
| Ownership checks    | None      | isPostOwner() utility          | 7       |
| JWT decoding        | None      | Via jwt-decode library         | 2, 3    |

### UX Features

| Feature             | Baseline | Current                  | Session |
| ------------------- | -------- | ------------------------ | ------- |
| Loading states      | None     | "Yükleniyor..." spinners | 5, 7    |
| Empty states        | None     | Friendly messaging       | 5       |
| Toast notifications | None     | Success/error feedback   | 9       |
| Character counter   | None     | Real-time, color-coded   | 5       |
| Relative timestamps | None     | "2 hours ago" via Day.js | 6       |
| Error boundaries    | None     | Graceful error handling  | 9       |
| Optimistic updates  | None     | Like/unlike immediate    | 6, 11   |

### File Count Summary

| Category                     | Baseline | Current | Change  |
| ---------------------------- | -------- | ------- | ------- |
| Pages                        | 3        | 5       | +2      |
| Components                   | 0        | 9       | +9      |
| Layouts                      | 1        | 2       | +1      |
| Redux slices                 | 0        | 3       | +3      |
| Utils                        | 0        | 4       | +4      |
| Hooks                        | 0        | 1       | +1      |
| Icons                        | 0        | 3       | +3      |
| CSS files                    | 2        | 2       | 0       |
| **Total new .jsx/.js files** | ~6       | ~30     | **+24** |

---

## Validation Against Baseline

This sessions log has been validated against actual code inspection:

- ✅ All new files confirmed to exist in current project
- ✅ All deleted files confirmed missing from current project
- ✅ All Redux actions/reducers confirmed implemented
- ✅ All API endpoints confirmed in devserver.js
- ✅ All component features confirmed implemented
- ✅ Dependencies confirmed in package.json
- ✅ No features documented that don't exist in code
- ✅ All sessions logically ordered by dependency

**Goal**

- Introduce predictable state management for tweets and authentication.

**Key changes**

- Created Redux Toolkit store.
- Implemented tweet state with reducers for load/add/delete/like/reply and selectors for multiple timeline views.
- Implemented user state with login/logout, token persistence, and current-user selector.
- Wired the Redux provider into the app entry.

**Files changed**

- `src/redux/store.js`
- `src/redux/tweetsSlice.js`
- `src/redux/userSlice.js`
- `src/main.jsx`

**Result**

- Global state is centralized; pages/components can query and mutate tweet and user state consistently.

**Notes / follow-ups**

- Tweet handling supports nested replies; selectors flatten/filter content depending on mode.

---

## Session 3 - Mock API (MirageJS) and axios utilities

**Goal**

- Enable end-to-end UX without a real backend by providing a local mock server and a consistent HTTP client.

**Key changes**

- Added MirageJS server with routes for login, signup, tweet CRUD, likes, replies, and user profile lookup.
- Implemented token decoding helper to support `Bearer ...` and JWT-like tokens.
- Added axios instance helpers to set/remove Authorization header.
- Added localStorage auth helpers for storing/removing/restoring token.

**Files changed**

- `src/utils/devserver.js`
- `src/utils/axios.js`
- `src/utils/auth.js`
- `src/App.jsx`

**Result**

- The UI can authenticate and interact with tweets against a stable in-browser mock API.

**Notes / follow-ups**

- The mock server currently includes debug logging in a few handlers; keep or remove depending on desired verbosity.

---

## Session 4 - Project restructure into pages/layouts/components

**Goal**

- Convert the baseline “root-level pages” structure into a scalable React layout/page/component architecture.

**Key changes**

- Moved route-level screens into `src/pages/`.
- Introduced reusable layouts under `src/layouts/`.
- Removed baseline root-level page/layout files.
- Updated routing to match the new pages and parameter naming.

**Files changed**

- Added:
  - `src/pages/Home.jsx`
  - `src/pages/Login.jsx`
  - `src/pages/Signup.jsx`
  - `src/pages/Profile.jsx`
  - `src/pages/Detail.jsx`
  - `src/layouts/AuthLayout.jsx`
  - `src/layouts/PageLayout.jsx`
- Removed:
  - `src/Login.jsx`
  - `src/Signup.jsx`
  - `src/PageLayout.jsx`
  - `src/AuthLayout.jsx`
- Modified:
  - `src/App.jsx`

**Result**

- The codebase is organized by responsibility; routing points at dedicated page modules.

**Notes / follow-ups**

- Current routing uses `/:username` for profile pages and `/detail/:tweetId` for detail pages.

---

## Session 5 - Timeline UI and tweet creation

**Goal**

- Build the core feed UI (timeline) with tweet creation and timeline mode switching.

**Key changes**

- Created timeline component(s) to list posts.
- Added a tweet composer (editor) with validations and UX feedback.
- Added a timeline mode selector (timeline / tweets / replies / most liked).
- Applied Tailwind theme + global styling improvements (app background, fonts, basic animation).

**Files changed**

- `src/components/Timeline.jsx`
- `src/components/TimelineSelector.jsx`
- `src/components/PostEditor.jsx`
- `src/components/Post.jsx`
- `tailwind.config.js`
- `src/index.css`
- `src/App.css`

**Result**

- Users can browse a feed, switch modes, and create tweets via the UI.

**Notes / follow-ups**

- “Most liked” mode is implemented client-side via selectors (last 24h, sorted by like count).

---

## Session 6 - Replies and thread/detail view

**Goal**

- Support conversation threads: replying to tweets, viewing replies, and rendering a coherent detail page.

**Key changes**

- Added replies list UI with newest-first sorting.
- Added reply editor functionality.
- Implemented detail view that can render a main tweet and its replies; supports finding nested replies.

**Files changed**

- `src/components/Replies.jsx`
- `src/components/ReplyEditor.jsx`
- `src/pages/Detail.jsx`
- `src/redux/tweetsSlice.js`

**Result**

- Nested conversations work: users can reply, see threads, and open detail pages reliably.

**Notes / follow-ups**

- Tweet lookup needs to handle nested structures (parent tweets + replies); selectors and recursive helpers support this.

---

## Session 7 - Profile page and ownership rules

**Goal**

- Implement user profile views and ensure “who can do what” rules are respected.

**Key changes**

- Added profile page that supports viewing user-specific content and activity.
- Added ownership helper used to decide whether delete/editor actions should be available.

**Files changed**

- `src/pages/Profile.jsx`
- `src/utils/ownership.js`

**Result**

- Profiles render consistently and ownership-sensitive actions can be gated.

**Notes / follow-ups**

- Ownership checks rely on decoded token data (e.g., `sub`, `nickname`) matching tweet `authorId` / `username`.

---

## Session 8 - Auth UX (login modal) and branding

**Goal**

- Improve authentication UX and add app branding across auth surfaces.

**Key changes**

- Added a header/navigation component.
- Added a login modal for in-context login.
- Added icon assets (light/dark logo variants + raven icons).

**Files changed**

- `src/components/Header.jsx`
- `src/components/LoginModal.jsx`
- `src/icon/logo-dark.svg`
- `src/icon/logo-light.svg`
- `src/icon/raven_24dp_121054_FILL0_wght400_GRAD0_opsz24.svg`
- `src/icon/raven_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg`

**Result**

- Users can authenticate without leaving context; UI has consistent branding.

**Notes / follow-ups**

- The project still includes a dedicated `/login` page route in addition to the modal.

---

## Session 9 - Resilience and global polish

**Goal**

- Improve app stability and perceived quality.

**Key changes**

- Added an error boundary around the app.
- Added global toast notifications container and general loading states.
- Restored auth session on refresh by rehydrating token from localStorage and setting axios auth header.

**Files changed**

- `src/components/ErrorBoundary.jsx`
- `src/main.jsx`
- `src/App.jsx`

**Result**

- Runtime errors are contained; auth sessions persist across reloads; UI feedback is consistent.

**Notes / follow-ups**

- Consider standardizing the README encoding (some headings include replacement characters).

---

## Session 10 - Naming alignment (twit → tweet) and compatibility

**Goal**

- Align naming across codebase and prevent broken imports while transitioning.

**Key changes**

- Standardized the primary slice naming on “tweets”.
- Added a compatibility re-export so older “twits” imports can keep working.

**Files changed**

- `src/redux/tweetsSlice.js`
- `src/redux/twitsSlice.js`
- `src/pages/*`
- `src/components/*`
- `src/utils/devserver.js`

**Result**

- The app consistently uses “tweet” concepts while still tolerating “twit” legacy imports.

**Notes / follow-ups**

- If the migration is complete, you can eventually remove the compatibility shim.

---

## Session 11 - Documentation and cleanup

**Goal**

- Finalize baseline→current cleanup and document the evolved project.

**Key changes**

- Updated README to reflect the evolved architecture and feature set.
- Removed unused baseline asset and ensured ignores/config stayed aligned.

**Files changed**

- `README.md`
- `.gitignore`
- `index.html`
- `postcss.config.js`
- `eslint.config.js`
- `vite.config.js`
- Removed: `src/assets/react.svg`

**Result**

- Repository is cleaner and documentation better reflects the current implementation.

**Notes / follow-ups**

- `references/_baseline_diff_summary.txt` is the authoritative file-level inventory used to validate coverage.
