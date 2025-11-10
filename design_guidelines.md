# Design Guidelines for نماء (Namaa) - Faith & Productivity Tracker

## Design Approach
**Reference-Based Approach**: Drawing inspiration from productivity apps (Notion, Todoist) and meditation/wellness apps (Calm, Headspace) to create an elegant, spiritually-focused experience that balances serenity with functionality.

## Core Design Principles
- **Spiritual Serenity**: Clean, uncluttered interfaces that promote focus and reflection
- **Cultural Sensitivity**: Thoughtful integration of Islamic aesthetics without being overly decorative
- **Purposeful Elegance**: Every element serves the user's spiritual and productivity journey
- **Seamless Bilingualism**: Equal treatment of Arabic (RTL) and English (LTR) with proper text alignment and mirroring

## Color Palette (User-Specified)
- **Primary Theme**: White & gold (elegant, modern, clean)
- **Dark Mode**: Deep navy/charcoal backgrounds with gold accents
- **Light Mode**: Pure white/cream backgrounds with warm gold highlights
- Soft, muted tones for progress indicators and secondary elements

## Typography System

**Primary Font**: Use Google Fonts - 'Inter' for English, 'Cairo' or 'Tajawal' for Arabic
- **Hero/Headings**: Bold weights (700), larger sizes for impact
- **Body Text**: Regular (400) and Medium (500) for readability
- **Micro-text**: Light (300) for secondary information

**Hierarchy**:
- Page titles: text-3xl to text-4xl
- Section headers: text-xl to text-2xl  
- Card titles: text-lg to text-xl
- Body content: text-base
- Helper text: text-sm
- Timestamps/meta: text-xs

**RTL/LTR Considerations**: Implement dynamic text alignment (text-right for Arabic, text-left for English) and ensure proper number rendering in both languages.

## Layout System

**Spacing Scale**: Use Tailwind units of 2, 4, 6, 8, 12, 16, 20, 24
- Micro spacing: p-2, gap-2 (8px)
- Component spacing: p-4, p-6 (16-24px)
- Section spacing: p-8, py-12, py-16 (32-64px)
- Major divisions: py-20, py-24 (80-96px)

**Grid Structure**:
- Desktop: max-w-7xl container with 2-3 column layouts for dashboards
- Dashboard cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Tablet: 2-column maximum, comfortable spacing
- Mobile: Single column, full-width cards with generous padding (p-4 to p-6)

**Card System**:
- Rounded corners: rounded-xl to rounded-2xl
- Soft shadows: shadow-md to shadow-lg on light mode, shadow-xl with glow on dark mode
- Card padding: p-6 to p-8 for content
- Card gaps: gap-4 to gap-6 in grids

## Component Library

### Navigation
- **Top Navigation Bar**: Fixed header with logo (left/right based on language), language toggle, theme toggle, user greeting, logout
- **Side Navigation** (Desktop): Expandable sidebar with icons + labels, smooth slide animation
- **Bottom Navigation** (Mobile): Fixed bottom bar with 5 core sections (Home, Tasks, Prayers, Quran, More)
- Icon size: 20-24px for navigation items

### Progress Indicators
- **Circular Progress**: For Pomodoro timer, daily prayer completion (large: 120-160px diameter)
- **Linear Progress Bars**: For daily tasks, Quran reading, lessons (h-2 to h-3, rounded-full)
- **Percentage Display**: Show completion rates with animated counting effect
- Smooth fill animations with 300-500ms transitions

### Cards & Containers
- **Dashboard Cards**: Equal height, hover lift effect (translate-y-1), smooth shadow transition
- **Prayer Cards**: Horizontal layout with prayer name, time, checkbox, status indicator
- **Task Cards**: Checkbox left/right (based on language), priority flag, Pomodoro button, delete action
- **Stat Cards**: Large number display, label below, icon or small chart graphic
- **Spacing within cards**: p-6, with inner elements using gap-4

### Forms & Inputs
- **Input Fields**: rounded-lg, h-12, px-4, focus ring in gold accent
- **Checkboxes**: Large touch targets (w-6 h-6), smooth check animation with scale effect
- **Buttons**: 
  - Primary: px-6 py-3, rounded-lg, gold background, white text
  - Secondary: border-2 gold, transparent bg
  - Icon buttons: p-3, rounded-full
- **Dropdowns**: Custom styled with chevron icons, smooth expand animation

### Authentication Screens
- **Login/Signup**: Centered card (max-w-md), full-screen subtle gradient background
- Large app logo at top
- Form fields with generous spacing (gap-4)
- Primary CTA button prominent and wide

### Intro Animation
- Full-screen overlay with centered logo
- Fade-in logo with subtle scale animation (0.9 to 1.0)
- Optional: Animated Arabic calligraphy or geometric Islamic patterns
- Duration: 2-3 seconds, then smooth fade to dashboard
- Only shows on first visit or explicit trigger

### Motivational Elements
- **Quote Cards**: Italic text, larger font, centered, with subtle decorative borders
- **Quranic Verse Display**: Distinguished typography, Arabic calligraphic font, translation below
- **Daily Intention**: Editable text area with placeholder, minimal border, focus state highlights

### Charts & Statistics
- **Chart Types**: Line charts for trends, donut charts for completion percentages, bar charts for weekly comparisons
- Use library like Chart.js with custom gold color scheme
- Responsive sizing: h-64 to h-80 on desktop, h-48 on mobile
- Clear axis labels, grid lines with low opacity

### Settings Page
- **List Layout**: Each setting in its own row with label left/right, control on opposite side
- Toggle switches for theme/language
- Slider for font size with live preview
- Backup/Restore: Prominent buttons with icons
- Danger zone (reset/logout): Separated at bottom with red accent

### Weekly Overview
- **Calendar Grid**: 7 columns for days, rows for each tracking category
- Each cell shows completion status with color coding and mini progress indicator
- Summary row at bottom with weekly totals
- Mobile: Swipeable horizontal cards for each day

### Lessons Tracker
- **Day Cards**: Manually added, chronological order
- Each metric (Focus, Interaction, etc.) as horizontal slider or radio button group (1-5 rating)
- Mini-task checklist within each day card
- Weekly summary chart showing averages and trends

### Alarm/Reminder System
- **Reminder List**: Time + label + repeat indicator + edit/delete actions
- Add new reminder: Modal or slide-in panel with time picker
- Visual indicator on dashboard for upcoming reminders (next 3 in timeline view)

## Subtle Football Theme Integration
- Small football emoji (⚽) or icon used sparingly:
  - As bullet points in motivational quotes
  - Small decoration in achievement celebrations
  - Optional badge/sticker on completed tasks
- Size: 16-20px, low opacity (opacity-40 to opacity-60)
- Never prominent or distracting

## Responsive Breakpoints
- Mobile: < 768px (base Tailwind)
- Tablet: 768px - 1024px (md)
- Desktop: > 1024px (lg, xl)

## Animations & Transitions
- **Page Transitions**: Smooth fade or slide (200-300ms) when navigating between sections
- **Checkbox Completion**: Scale + checkmark draw animation (300ms)
- **Progress Bars**: Fill animation with ease-out (500ms)
- **Card Hover**: Subtle lift (4-8px) with shadow increase (200ms)
- **Pomodoro Timer**: Circular progress with smooth countdown, color shift as time decreases
- **Minimal Motion**: Avoid excessive animations; prioritize purposeful, meaningful motion

## Accessibility & UX
- Large touch targets (min 44x44px) for mobile
- High contrast between text and backgrounds
- Focus states clearly visible with gold ring
- Keyboard navigation support for all interactive elements
- ARIA labels for screen readers in both languages
- Proper heading hierarchy (h1 → h2 → h3)

## Imagery
**No large hero images**: This is a functional productivity app, not a marketing site. Focus on clean, data-driven interfaces with iconography and charts rather than photography.

**Icon Usage**: Use Heroicons or Font Awesome via CDN for:
- Navigation items
- Action buttons (edit, delete, add)
- Status indicators (completed, pending, missed)
- Setting controls