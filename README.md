# Old Ellicott City Photo Competition

A mobile-first web application mockup for Old Ellicott City Partnership's 9-month photo competition where users recreate historical memories and compete for recognition on the Wall of Fame.

## Features

- **Two-Photo Submission System** - Users upload both an original historical photo and their modern recreation
- **Location Tracking** - Submissions are tagged with specific locations from the Old Ellicott City area
- **Monthly Public Voting** - Community members vote on their favorite photo recreations
- **Wall of Fame** - Displays past winners and celebrates top submissions
- **Mobile-First Design** - Fully responsive interface optimized for mobile devices
- **Swipeable Carousel** - Touch-enabled photo carousel for browsing submissions
- **User Authentication** - Simple dummy login system with email/phone and arbitrary username
- **Real-Time Interactions** - Vote, comment, and engage with mock submissions

## Tech Stack

**Frontend:**
- React 18 with TypeScript
- Tailwind CSS for styling
- Zustand for state management
- shadcn/UI components
- Framer Motion for animations
- Lucide React for icons
- Wouter for routing (client-side)

**Fonts:**
- Monotype Corsiva - Logo and headings
- Cardo - Body text and descriptions

**Brand Colors:**
- OEC Red (#F71F1F) - Primary accent
- Patapsco Blue (#3C5A60) - Secondary accent
- Antique Ivory (#F5F0E0) - Background
- Earth Brown (#452829) - Foreground text
- Rustic Brown (#874921) - Muted text

## Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev:client
```

The application will be available at `http://localhost:5000`

## Project Structure

```
client/
├── src/
│   ├── pages/              # Page components (Landing, Login, Feed, Submit, Wall)
│   ├── components/         # Reusable UI components
│   │   ├── ui/            # shadcn/UI components
│   │   └── MobileLayout.tsx
│   ├── lib/
│   │   ├── store.ts       # Zustand state management
│   │   ├── businesses.ts  # Location data
│   │   └── dates.ts       # Date utilities
│   ├── index.css          # Theme and styling
│   └── App.tsx            # Main app component
├── public/
│   ├── logo_main.png      # Landing page logo
│   ├── logo_layout.png    # Navbar logo
│   └── favicon.png
└── index.html             # HTML entry point
```

## Key Components

### Landing Page
- Introduces the competition
- Showcases featured photos
- Entry point for new users

### Login
- Email/Phone authentication
- Username selection
- Form validation

### Feed
- Displays all submissions
- Voting and commenting system
- Monthly competition info
- Swipeable photo carousel

### Submit
- Two-photo upload (retro + recreated)
- Location selection with custom option
- Story/caption field
- Form validation requiring all fields

### Wall of Fame
- Displays past winners
- Historic photo highlights
- Competition results

## State Management

The app uses Zustand for centralized state management:

- **User** - Current logged-in user
- **Posts** - All photo submissions
- **Votes** - User voting data
- **Navigation** - Current page state

All state is persisted to localStorage for offline access.

## Data Format

### Post Object
```typescript
{
  id: string;
  username: string;
  retroImage: string;           // Base64 encoded
  recreatedImage: string;       // Base64 encoded
  retroLocation?: string;
  recreatedLocation?: string;
  description: string;
  likes: number;
  comments: Comment[];
  timestamp: number;
}
```

### Comment Object
```typescript
{
  author: string;
  text: string;
  timestamp: number;
}
```

## Testing

The codebase includes `data-testid` attributes on all interactive and display elements for testing purposes:

- Interactive: `{action}-{target}` (e.g., `button-vote-${id}`)
- Display: `{type}-{content}-${id}` (e.g., `text-votes-${id}`)

## Deployment

The app is built as a static SPA and works on any static hosting service:

```bash
# Build for production
npm run build

# Output is in the dist/ folder
```

The app routes all navigation through state management (no URL changes), making it compatible with static hosts without redirect rules (Netlify, Vercel, GitHub Pages, etc.).

## Browser Support

- Chrome (latest)
- Safari (latest)
- Firefox (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Asset Updates

### Updating Logos
- Replace `client/public/logo_main.png` for the landing page logo
- Replace `client/public/logo_layout.png` for the navbar logo
- No code changes needed - logos update automatically once rebuilt and deployed

## Development Guidelines

- All code changes are frontend-only (no backend modifications)
- Data is stored in localStorage (no database)
- Component files go in `client/src/pages/` and `client/src/components/`
- Use Tailwind CSS for styling
- Add `data-testid` attributes to all interactive elements

## Meta Tags

Open Graph and Twitter Card meta tags are configured in `client/index.html` and should be updated when the app name or description changes.


## Contact

For questions or support, contact the kmekonnen2@stevenson.edu
