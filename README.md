# ChaiTube

A modern React app that fetches and displays YouTube videos using the FreeAPI public endpoint.

## Live Demo

https://chaitube-l8ap.onrender.com/

ChaiTube lets users:
- Search videos by keyword
- Sort by multiple options
- Browse paginated results
- View thumbnail, title, channel, description, likes, views, and publish date
- Open videos directly on YouTube

## Demo Features

- Search query input with submit action
- Sorting:
  - Most Liked
  - Most Viewed
  - Latest
  - Oldest
- Pagination controls (Previous / Next)
- Loading, empty-state, and error handling UI
- Compact stats formatting (e.g., `12.5K`, `1.2M`)
- Responsive card-based layout

## Tech Stack

- React 19
- Vite 8
- CSS (custom styling in `src/App.css`)
- Fetch API + `AbortController` for request cleanup

## API Used

FreeAPI endpoint:

`https://api.freeapi.app/api/v1/public/youtube/videos`

Query parameters used:
- `page`
- `limit`
- `query`
- `sortBy`

Example request:

```txt
https://api.freeapi.app/api/v1/public/youtube/videos?page=1&limit=12&query=javascript&sortBy=mostViewed
```

## Project Structure

```txt
youtube-videos-react/
├─ src/
│  ├─ App.jsx        # Main app logic and UI rendering
│  ├─ App.css        # Styling (layout, typography, components)
│  └─ main.jsx       # App entry
├─ package.json
└─ README.md
```

## Getting Started

### 1. Clone and open project

```bash
git clone <your-repo-url>
cd youtube-videos-react
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run development server

```bash
npm run dev
```

Open the local URL shown in terminal (usually `http://localhost:5173`).

## Available Scripts

- `npm run dev` - Start local development server
- `npm run build` - Build production bundle
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint checks

## How It Works

1. App starts with default query: `javascript`
2. On query/sort/page change, the app fetches fresh results
3. Response data is normalized to handle possible payload shapes
4. Cards are rendered in a responsive grid
5. Each card links to the corresponding YouTube video

## Error Handling

- Handles failed API responses with user-friendly messages
- Prevents state updates from cancelled requests using `AbortController`
- Shows dedicated states for:
  - Loading
  - Error
  - No videos found

## UI Notes

- Brand title: **ChaiTube**
- Font pairing in `App.css`:
  - `Bricolage Grotesque` for heading
  - `Sora` for app text

## Customization Ideas

- Add dark mode toggle
- Add category chips (music, coding, gaming, etc.)
- Add debounce on search input
- Save last query/sort/page in local storage
- Add skeleton loaders for cards
- Add "Open in new tab" icon action per card

## Troubleshooting

- If videos fail to load:
  - Check internet connection
  - Verify API endpoint is accessible
  - Open browser devtools and inspect network errors
- If styles look off:
  - Confirm `src/App.css` is imported in `App.jsx`
  - Confirm Google Fonts load correctly

## License

This project is for learning and personal development use.
