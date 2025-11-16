# Airport Projects Dashboard

A modern Next.js dashboard for visualizing airport projects worldwide with interactive filtering, search, and analytics.

## ✨ Features

- 📊 **Data Table** - View all projects with sortable columns and CSV export
- 🗺️ **Map View** - Interactive map showing project locations (ready for integration)
- 📈 **Analytics** - Charts and statistics for project insights
- 🔍 **Advanced Filtering** - Filter by country, status, and search across all fields
- 📥 **CSV Export** - Download filtered data

## 🚀 Deploy to Vercel

### Quick Deploy (Recommended)

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/airport-projects-dashboard.git
   git push -u origin main
   ```

2. **Deploy on Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Click "Deploy"
   - Done! ✅

Your app will be live at: `https://your-project.vercel.app`

## 💻 Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
airport-projects-dashboard/
├── app/
│   ├── page.js          # Main dashboard component
│   ├── layout.js        # Root layout
│   └── globals.css      # Global styles
├── package.json         # Dependencies
├── tailwind.config.js   # Tailwind configuration
└── next.config.js       # Next.js configuration
```

## 🔧 Connecting Google Sheets (Next Step)

To connect your actual Google Sheets data, you'll add an API route that fetches from Google Sheets API.

We'll set this up once the basic app is deployed!

## 📝 License

MIT
