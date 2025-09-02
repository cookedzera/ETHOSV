# 🔍 ETHOSV - Trust Score Scanner

**ETHOSV** is a sophisticated trust reputation scanner built on top of the **Ethos Protocol**. Designed as a Farcaster Mini App, it provides comprehensive trust analysis across multiple Web3 platforms.

## ✨ Features

- 🔍 **Smart Search** - Multi-platform user discovery (Ethereum, Farcaster, Twitter/X)
- 📊 **Trust Score Analysis** - Real-time scoring with tier visualization
- 🛡️ **R4R Detection** - Advanced fraud detection algorithms
- 💎 **Vouch Intelligence** - Comprehensive vouch analysis with USD values
- 📱 **Farcaster Integration** - Native miniapp with frame generation
- 🎨 **Modern UI** - Glassmorphism design optimized for performance

## 🏗️ Architecture

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Serverless Functions (Vercel)
- **Styling**: Tailwind CSS with glassmorphism effects
- **State Management**: TanStack Query (React Query)
- **Data Source**: Ethos Protocol V1 & V2 APIs

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- npm or yarn

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Deployment

This project is optimized for **Vercel deployment**:

1. Push to GitHub
2. Connect to Vercel
3. Deploy automatically

## 📁 Project Structure

```
ETHOSV/
├── client/               # React frontend
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── lib/          # Utility libraries
│   │   └── pages/        # Page components
├── api/                  # Vercel serverless functions
├── server/               # Original Express server (legacy)
├── shared/               # Shared schemas and types
└── public/               # Static assets
```

## 🔧 Environment Variables

Create a `.env.local` file:

```env
# Add any required API keys here
```

## 🌐 API Endpoints

- `/api/health` - Health check
- `/api/search-user` - User search
- `/api/search-user-farcaster` - Farcaster-specific search
- `/api/enhanced-profile/[userkey]` - Enhanced profile data
- `/api/farcaster-manifest` - Farcaster miniapp manifest

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🔗 Links

- [Ethos Protocol](https://ethos.network)
- [Farcaster](https://farcaster.xyz)
- [Vercel](https://vercel.com)

---

Built with ❤️ for the Web3 community