# OttersStory Discord Bot (TypeScript)

A TypeScript Discord bot for the OttersStory MapleStory private server, rewritten from Go to TypeScript using discord.js.

## Features

- **Slash Commands**: Modern Discord slash command interface
- **User Verification**: Timezone and IGN verification system
- **Party Organization**: Horntail party scheduling with role assignments
- **Price Checking**: AI-powered item price estimation using OpenAI
- **Game Guides**: Interactive Orbis PQ guide
- **Fun Commands**: Smick command for community interaction
- **Suggestion System**: Modal-based feature requests and bug reports

## Commands

- `/opq-guide` - Display Orbis PQ guide
- `/ht-pt <date>` - Schedule a Horntail party
- `/suggest` - Submit a suggestion or bug report
- `/pc <prompt>` - Get item price estimates using AI
- `/verify` - Verify your IGN and timezone
- `/time [user]` - Show user's current time
- `/smick <user>` - Fun smick command

## Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- Discord Bot Token
- OpenAI API Key (for price checking)

### Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Copy environment file:

   ```bash
   cp env.example .env
   ```

4. Configure your `.env` file:
   ```
   DISCORD_TOKEN=your_discord_bot_token
   OPENAI_API_KEY=your_openai_api_key
   ```

### Development

```bash
# Run in development mode
npm run dev

# Run with watch mode
npm run dev:watch

# Build for production
npm run build

# Start production build
npm start
```

### Docker

```bash
# Build Docker image
docker build -t otters-discord-bot .

# Run with Docker Compose
docker-compose up -d
```

## Database

The bot uses SQLite for data persistence. The database file (`database.db`) will be created automatically on first run.

### Schema

```sql
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    ign TEXT,
    timezone TEXT
);
```

## Architecture

- **TypeScript**: Full type safety and modern JavaScript features
- **discord.js**: Official Discord API wrapper
- **SQLite**: Lightweight database for user data
- **OpenAI Integration**: AI-powered price checking
- **Modular Design**: Clean separation of concerns

## Deployment

The bot is designed to run in Docker containers with:

- Multi-stage build for optimized image size
- Secret management for sensitive data
- Volume mounting for database persistence
- Health checks and graceful shutdown

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
