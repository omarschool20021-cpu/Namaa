# نماء | Namaa - Faith & Productivity Tracker

A beautiful bilingual (Arabic/English) web application for tracking personal faith, study, and productivity.

## Project Overview

Namaa is a comprehensive productivity and faith tracking application with an elegant white & gold theme. It supports both Arabic (RTL) and English (LTR) languages and provides dark/light mode switching.

## Features Implemented

### Core Features
- ✅ User authentication (username + password) with Local Storage
- ✅ Bilingual support (Arabic RTL / English LTR)
- ✅ Dark/Light mode toggle
- ✅ Intro animation on first visit
- ✅ Fully responsive design (desktop, tablet, mobile)

### Pages & Functionality
1. **Dashboard** - Daily overview with progress bars, intention setting, motivational quotes
2. **Tasks** - Task management with Pomodoro timer, filters, priority flags
3. **Prayers** - Track 5 daily prayers with completion feedback
4. **Quran** - Custom goal setting (Pages/Juz/Quarter/Hizb) with progress tracking
5. **Lessons** - Manual day addition with 5 metrics and weekly averages
6. **Weekly Overview** - 7-day summary across all tracking categories
7. **Statistics** - Charts and graphs for tasks, prayers, and completion trends
8. **Motivation** - Random quotes with custom quote addition
9. **Settings** - Theme, language, font size, backup/restore, data reset

### Technical Architecture

#### Frontend Stack
- React 18 with TypeScript
- Wouter for routing
- Tailwind CSS for styling
- Shadcn UI component library
- Recharts for statistics visualization
- Context API for state management (Theme, Language, Auth)

#### Data Persistence
- All data stored in browser Local Storage
- Per-user data separation
- Backup/Restore functionality (JSON export/import)
- Data includes: tasks, prayers, Quran progress, lessons, reminders, settings, quotes

#### Components Structure
```
client/src/
├── components/
│   ├── Layout.tsx - Main layout with navigation
│   ├── PomodoroTimer.tsx - Pomodoro timer with circular progress
│   └── ui/ - Shadcn UI components
├── contexts/
│   ├── AuthContext.tsx - User authentication
│   ├── ThemeContext.tsx - Dark/Light mode
│   └── LanguageContext.tsx - Bilingual support with translations
├── lib/
│   ├── localStorage.ts - All localStorage CRUD operations
│   └── queryClient.ts - React Query setup
├── pages/
│   ├── Auth.tsx - Login/Signup
│   ├── Dashboard.tsx - Home page
│   ├── Tasks.tsx - Task management
│   ├── Prayers.tsx - Prayer tracking
│   ├── Quran.tsx - Quran goal tracking
│   ├── Lessons.tsx - Lesson day tracking
│   ├── Weekly.tsx - Weekly overview
│   ├── Statistics.tsx - Charts & stats
│   ├── Motivation.tsx - Motivational quotes
│   └── Settings.tsx - User settings
└── types/
    └── index.ts - TypeScript interfaces

server/ - Minimal Express server (serves frontend only)
```

#### Theme & Design
- **Primary Color**: Gold (43° 90% 48%) - represents spiritual growth
- **White & Gold Theme**: Clean, elegant, modern aesthetic
- **Typography**: Inter for English, Cairo for Arabic
- **Spacing**: Consistent 4px-based spacing system
- **Animations**: Smooth transitions, hover effects, progress animations
- **Accessibility**: Proper ARIA labels, keyboard navigation, high contrast

## User Flow

1. **First Visit**: Intro animation → Sign up
2. **Daily Usage**: Login → Dashboard (view progress, set intention) → Track tasks/prayers/quran → View statistics
3. **Weekly Review**: Check weekly overview for patterns
4. **Settings**: Customize theme, language, backup data

## Data Models

- **User**: id, username, name
- **Task**: id, userId, title, completed, priority, dueDate, createdAt
- **Prayer**: id, userId, date, fajr, dhuhr, asr, maghrib, isha
- **QuranGoal**: id, userId, type, quantity, progress[], createdAt
- **LessonDay**: id, userId, date, focus, interaction, homework, mistakeReduction, respectDiscipline, tasks[]
- **Reminder**: id, userId, title, time, repeat, type, enabled
- **Quote**: id, text, author, category, isCustom
- **UserSettings**: userId, theme, language, fontSize, dailyIntention

## Recent Changes

**2025-01-10**: Initial implementation
- Implemented all core features and pages
- Created bilingual translation system
- Set up Local Storage data persistence
- Implemented white & gold theme with dark mode
- Created responsive navigation (sidebar + bottom nav)
- Added Pomodoro timer integration
- Implemented statistics with Recharts
- Added backup/restore functionality

## Development Guidelines

- **Fonts**: Inter for English, Cairo for Arabic
- **RTL Support**: Automatic direction switching based on language
- **Data Storage**: All user data in localStorage with per-user keys
- **Theme Colors**: Use CSS variables from index.css (--primary for gold)
- **Responsive**: Mobile-first approach with Tailwind breakpoints

## Future Enhancements

- Cloud sync for multi-device access
- Prayer times API integration
- Advanced analytics and insights
- Social sharing features
- Gamification (badges, streaks, achievements)
