# Germany Calculator

A React Native mobile application for tracking work hours, generating reports, and managing work sessions with multi-language support.

## Features

- ⏱️ **Work Timer** - Track your work sessions with Pause/Resume and real-time digit tick animations
- ✍️ **Manual Entry** - Add past work sessions manually with date/time validation
- ✏️ **Session Editing** - Long-press to edit notes or times of existing sessions
- 📊 **Detailed Reports** - Generate monthly and weekly analytics with charts
- 💾 **Work Hours Management** - Store and manage your employer information and work hours
- 🌐 **Multi-Language Support** - Available in German, English, French, and Turkish
- 🎨 **Dark/Light Mode** - Modern UI with fluid theme transitions and animations
- 📱 **Cross-Platform** - Built with React Native and Expo for iOS and Android
- 💬 **Toast Notifications** - User-friendly feedback notifications
- 📄 **PDF Export** - Generate PDF reports with §4 ArbZG (rest break) warnings
- ✨ **Rich Animations** - Digit tick transitions, pulse effects, and color-shifting buttons

## Tech Stack

- **React Native** - Cross-platform mobile development
- **Expo** - Development platform and build tools
- **TypeScript** - Type-safe development
- **Zustand** - State management
- **React Navigation** - Navigation framework

## Project Structure

```
src/
├── core/                 # Core services and storage
│   ├── services/         # Analytics, notifications, PDF services
│   ├── storage/          # Data persistence repositories
│   └── types/            # TypeScript models
├── features/             # Feature modules
│   ├── timer/            # Main timer feature
│   ├── reports/          # Reports and statistics
│   └── settings/         # Settings and configuration
├── shared/               # Shared components and utilities
│   ├── components/       # Reusable UI components
│   ├── hooks/            # Custom React hooks
│   └── utils/            # Utility functions
├── store/                # Global state management
├── theme/                # Theme configuration
├── navigation/           # App navigation setup
├── locales/              # Multi-language translations
└── App.tsx              # Main app entry point
```

## Installation

### Prerequisites
- Node.js 14+ and npm/yarn
- Expo CLI: `npm install -g expo-cli`
- React Native development environment

### Setup

1. Clone the repository:
```bash
git clone https://github.com/sadiq990/germancalculator.git
cd germanycalculator
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
expo start
```

4. Run on device or emulator:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app on physical device

## Scripts

- `npm start` - Start the development server (defaults to LAN)
- `npm run lan` - Start in LAN mode (for local WiFi testing)
- `npm run tunnel` - Start in Tunnel mode (for remote/VPN testing via Expo Go)
- `expo build:ios` - Build for iOS
- `expo build:android` - Build for Android
- `npm run type-check` - Run TypeScript type checking (`tsc --noEmit`)

## Key Features

### Timer Module (`src/features/timer/`)
- Start/stop/pause/resume work sessions
- Real-time duration tracking with "digit tick" translateY animations
- Dynamic color-shifting "Start/Stop" button based on timer phase
- Daily statistics dashboard with legal requirement warnings
- Interactive onboarding tips for new users
- **Manual Entry Sheet**: Add sessions with date/time pickers and overlap validation
- **Edit Session Sheet**: Long-press any session to modify notes or times (active sessions locked)

### Reports Module (`src/features/reports/`)
- Monthly statistics visualization
- Weekly performance charts
- Month/week picker for date navigation
- PDF export functionality

### Settings Module (`src/features/settings/`)
- Employer management
- Language selection (DE, EN, FR, TR)
- App configuration

### Core Services
- **Analytics Service** - Event tracking and analytics
- **Notification Service** - Push and local notifications
- **PDF Service** - PDF generation and export
- **Storage Repositories** - Data persistence (work hours, settings)

## Localization

The app supports 4 languages:
- 🇩🇪 German (de)
- 🇬🇧 English (en)
- 🇫🇷 French (fr)
- 🇹🇷 Turkish (tr)

Language files are located in `src/locales/` and can be easily extended.

## Theme & Styling

The app includes a comprehensive theme system with:
- Color palette
- Typography definitions
- Spacing scale
- Shadow effects
- Light/Dark mode support

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is available on GitHub: [sadiq990/germancalculator](https://github.com/sadiq990/germancalculator)

## Author

Created by Sadiq

---

**Last Updated**: March 2026
