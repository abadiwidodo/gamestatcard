# 🏀 GameStatCard

A modern React web application for creating stunning NBA player stat cards for social media posts. Built with React, Vite, and styled with modern CSS.

## ✨ Features

- **Player Search**: Search for NBA players by name with autocomplete suggestions
- **Instagram Post Generator**: Create beautiful stat cards for social media
- **Interactive Design**: Drag & drop elements, change fonts, add backgrounds
- **Community Gallery**: Browse stat cards created by the community with #ae5history
- **Game Statistics**: View detailed stats from the last 5 games including:
  - Points, Rebounds, Assists
  - Steals, Blocks, Field Goal Percentage
  - Minutes played
- **Export Features**: Save as PNG with edit history tracking
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Modern UI**: Clean, professional interface with smooth animations

## 🚀 Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the development server**
   ```bash
   npm run dev
   ```

3. **Open your browser**
   Navigate to `http://localhost:5173` to view the application.

## 🛠️ Built With

- **React 19** - Frontend framework
- **Vite** - Build tool and development server
- **Axios** - HTTP client for API requests
- **Lucide React** - Beautiful icons
- **Modern CSS** - Custom styling with gradients and animations

## 📱 Usage

1. **Search for a Player**: Type a player name in the search box (e.g., "LeBron James", "Stephen Curry")
2. **View Results**: Click search or press Enter to see player information
3. **Analyze Stats**: Review the last 5 games statistics in the detailed table
4. **Check Averages**: View calculated averages at the bottom of the stats section

### Sample Players to Try

- LeBron James
- Stephen Curry
- Kevin Durant
- Giannis Antetokounmpo
- Luka Dončić
- Jayson Tatum
- Joel Embiid
- Nikola Jokić

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory for API configuration:

```env
# NBA API Configuration
REACT_APP_NBA_API_KEY=your_api_key_here
REACT_APP_NBA_API_URL=https://api.balldontlie.io/v1
```

## 📁 Project Structure

```
nba-stats-tracker/
├── public/
├── src/
│   ├── services/
│   │   └── nbaApi.js          # API service layer
│   ├── App.jsx                # Main application component
│   ├── App.css                # Application styles
│   ├── index.css              # Global styles
│   └── main.jsx               # Application entry point
├── .env.example               # Environment variables template
├── package.json
├── vite.config.js
└── README.md
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

---

**Made with ❤️ for basketball fans and developers**+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
