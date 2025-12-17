# 3D ASCII Model Viewer

A React application that renders 3D models as ASCII art in real-time. View built-in models (teapot, bunny, skull) or upload your own OBJ files.

## Features

- 🎨 Real-time 3D model rendering in ASCII art
- 🖼️ Canvas-based 3D rendering mode
- 🔄 Auto-rotation and manual rotation controls
- 🎨 Customizable colors and themes
- 📤 Upload OBJ format 3D models
- 📱 Responsive design

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
npm install
```

### Development

Start the development server:

```bash
npm start
```

The app will be available at `http://localhost:5173`

### Build

Build for production:

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Deployment to Vercel

This project is configured for easy deployment to Vercel:

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Vercel will automatically detect the Vite configuration
4. Deploy!

The `vercel.json` file is already configured with the correct build settings.

Alternatively, you can deploy using the Vercel CLI:

```bash
npm i -g vercel
vercel
```

## Project Structure

```
ascii-art/
├── App.tsx                 # Main app component
├── main.tsx                # Application entry point
├── components/
│   ├── AsciiViewer.tsx    # Main 3D ASCII viewer component
│   └── ui/                # UI components (shadcn/ui)
├── styles/
│   └── globals.css        # Global styles and Tailwind config
└── index.html             # HTML template
```

## Technologies

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Lucide React (icons)
