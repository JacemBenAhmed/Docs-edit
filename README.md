# Docs-edit

Document management platform with Google OAuth authentication built with Vue.js and Vite.

## 🚀 Quick Start

### 1. Install Dependencies

```sh
npm install
```

### 2. Environment Setup

Create a `.env` file in the root directory (see `ENV_SETUP.md` for details):

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

### 3. Run Development Server

```sh
npm run dev
```

### 4. Build for Production

```sh
npm run build
```

## 📋 Features

- ✅ Google OAuth Authentication
- ✅ JWT Token Management
- ✅ User Profile Management
- ✅ Responsive Design with Vuetify
- ✅ Document Management UI

## 📁 Project Structure

```
src/
├── components/        # Vue components
│   └── Navbar.vue    # Main navigation with Google login
├── services/          # API services
│   └── userService.js # Authentication service
├── views/            # Page components
├── router/           # Vue Router configuration
└── main.js           # App entry point
```

## 🔧 Backend Setup

See `BACKEND_FIXES.md` for backend code corrections and setup instructions.

## 📝 Important Files

- `src/services/userService.js` - Authentication logic
- `src/components/Navbar.vue` - Navigation and login UI
- `ENV_SETUP.md` - Environment variable configuration
- `BACKEND_FIXES.md` - Backend code fixes and improvements

## 🛠️ Technology Stack

- **Frontend**: Vue 3, Vite, Vuetify
- **Backend**: ASP.NET Core, Entity Framework, PostgreSQL
- **Authentication**: Google OAuth 2.0, JWT
- **API**: RESTful API with JSON

## 🤝 Development

### Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

### Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd) 
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## 📖 Customize Configuration

See [Vite Configuration Reference](https://vite.dev/config/).
