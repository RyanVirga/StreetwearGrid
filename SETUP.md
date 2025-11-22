# Local Development Setup Guide

## Issues Found from Replit Migration

### 1. **Missing Environment Variables**
The application requires a `DATABASE_URL` environment variable. Create a `.env` file in the project root:

```bash
DATABASE_URL=your_database_connection_string
PORT=3000
NODE_ENV=development
```

### 2. **Database Configuration**
The app currently uses Neon's serverless PostgreSQL driver. For Supabase, you'll need to update the database driver.

**Current Setup (Neon):**
- Uses `@neondatabase/serverless` package
- Requires WebSocket support

**For Supabase:**
- Uses standard PostgreSQL connection
- Need to switch to `pg` or `postgres` package instead

### 3. **Replit-Specific Plugins**
The Vite config includes Replit plugins that are conditionally loaded:
- `@replit/vite-plugin-cartographer` - Only loads if `REPL_ID` is set
- `@replit/vite-plugin-dev-banner` - Only loads if `REPL_ID` is set
- `@replit/vite-plugin-runtime-error-modal` - Always loaded (but safe to use locally)

These won't cause issues locally since they're conditional.

### 4. **Port Configuration**
- Default port is 5000 (can conflict with macOS AirPlay Receiver)
- Use PORT environment variable to override (e.g., PORT=3000)

### 5. **Missing Dependencies**
All dependencies appear to be installed. The `nanoid` package is used but should be in dependencies.

## Required Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `PORT` | Server port (optional) | `3000` |
| `NODE_ENV` | Environment mode | `development` |

## Supabase Setup

1. Create a Supabase project at https://supabase.com
2. Get your connection string from: Project Settings > Database > Connection string (URI mode)
3. Add to `.env` file:
   ```
   DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres
   ```

## Database Schema Migration

After setting up Supabase, run the database migrations:

```bash
npm run db:push
```

This will create the required tables (`users` and `merch_requests`) in your Supabase database.

## Running the Application

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env` file with your database URL

3. Push database schema:
   ```bash
   npm run db:push
   ```

4. Start development server:
   ```bash
   PORT=3000 npm run dev
   ```

5. Open browser: http://localhost:3000

## Known Issues

1. **Port 5000 conflict**: macOS AirPlay Receiver uses port 5000. Use a different port (3000 recommended).

2. **Database driver**: Current setup uses Neon's serverless driver. For Supabase, you may need to update `server/db.ts` to use standard PostgreSQL driver (`pg` package).

3. **File uploads**: Currently files are stored as metadata in the database. For production, you'll need to implement actual file storage (Supabase Storage, S3, etc.).

