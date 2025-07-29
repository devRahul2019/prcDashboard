# Supabase Setup Guide for PRC Repair Website

## 1. Create Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Sign in or create an account
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - Name: `prc-repair`
   - Database Password: (choose a strong password)
   - Region: Choose closest to your users
6. Click "Create new project"

## 2. Get Your Project URLs and Keys

1. Go to your project dashboard
2. Click on "Settings" in the sidebar
3. Click on "API"
4. Copy the following values:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **Anon Public Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 3. Set Environment Variables

Update your environment variables with the actual values:

```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## 4. Create Database Schema

1. Go to your Supabase project dashboard
2. Click on "SQL Editor" in the sidebar
3. Create a new query and run this SQL:

```sql
-- Create bookings table
CREATE TABLE bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  device_type TEXT NOT NULL,
  issue_description TEXT NOT NULL,
  status TEXT DEFAULT 'pending'
);

-- Enable Row Level Security
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow inserts for anonymous users (for the contact form)
CREATE POLICY "Allow anonymous inserts" ON bookings
FOR INSERT TO anon
WITH CHECK (true);

-- Create a policy to allow reading for authenticated users (for admin access)
CREATE POLICY "Allow authenticated reads" ON bookings
FOR SELECT TO authenticated
USING (true);

-- Create a policy to allow updates for authenticated users (for admin access)
CREATE POLICY "Allow authenticated updates" ON bookings
FOR UPDATE TO authenticated
USING (true);
```

## 5. Test the Connection

1. Update your `.env` file with real values
2. Restart your development server
3. Fill out the booking form on your website
4. Check the Supabase dashboard under "Table Editor" → "bookings" to see if the data was inserted

## 6. Optional: Set up Real-time Subscriptions

If you want real-time updates when new bookings come in:

```sql
-- Enable realtime for bookings table
ALTER PUBLICATION supabase_realtime ADD TABLE bookings;
```

## 7. Production Deployment

For production (Vercel/Netlify), make sure to set the environment variables in your deployment platform:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Troubleshooting

### Common Issues:

1. **"Invalid API key"**: Make sure your anon key is correct and hasn't expired
2. **"Table doesn't exist"**: Make sure you ran the SQL schema creation script
3. **"Permission denied"**: Check your Row Level Security policies
4. **"CORS error"**: Make sure your domain is added to the allowed origins in Supabase

### Checking Data:

1. Go to Supabase Dashboard
2. Click "Table Editor"
3. Select "bookings" table
4. You should see all form submissions here

## Security Notes

- The anon key is safe to use in the frontend
- Row Level Security ensures data protection
- Only allow what's necessary for your use case
- Consider adding rate limiting for production
