# Grievance Redressal System - Frontend

A modern React-based frontend for the Grievance Redressal System that provides an intuitive interface for students to file complaints and track their resolution.

## Features

- 🎨 Modern, responsive UI with Material Design
- 🔐 Secure authentication (JWT-based)
- 📱 Mobile-friendly design
- ⚡ Fast loading with optimized components
- 🔔 Real-time notifications
- 📊 Dashboard with complaint tracking
- 🔍 Advanced search and filtering
- 📄 PDF complaint generation
- 🌙 Dark/Light theme support

## Tech Stack

- **React 18** - Modern React with hooks
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Material-UI** - Component library
- **React Hook Form** - Form management
- **React Query** - Data fetching and caching
- **PWA** - Progressive Web App support

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## Project Structure

```
frontend/
├── public/
│   ├── index.html          # Main HTML template
│   ├── manifest.json       # PWA manifest
│   ├── service-worker.js   # Service worker
│   └── robots.txt          # SEO robots file
├── src/
│   ├── components/         # Reusable components
│   │   ├── Navbar.js       # Navigation bar
│   │   └── ...
│   ├── pages/              # Page components
│   │   ├── Home.js         # Home page
│   │   ├── Login.js        # Login page
│   │   ├── Dashboard.js    # User dashboard
│   │   └── ...
│   ├── styles/             # CSS styles
│   ├── App.js              # Main app component
│   └── index.js            # App entry point
└── package.json
```

## API Integration

The frontend communicates with the FastAPI backend through RESTful APIs:

- `POST /auth/register` - User registration
- `POST /auth/login` - User authentication
- `GET /complaints/` - Get user complaints
- `POST /complaints/` - Create new complaint
- `PUT /complaints/{id}/resolve` - Resolve complaint

## PWA Features

- Offline support
- Installable on mobile devices
- Push notifications
- Background sync

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## License

This project is licensed under the MIT License.