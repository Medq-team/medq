# Environment Variables Setup

To run this Next.js app, you need to set up your environment variables.

## Create a `.env.local` file in the root directory with:

```
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

## Important Notes:

1. **Next.js Environment Variables**: 
   - Use `NEXT_PUBLIC_` prefix for client-side variables
   - Variables without `NEXT_PUBLIC_` are only available server-side

2. **Migration from Vite**:
   - `VITE_SUPABASE_URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. **Get your Supabase credentials**:
   - Go to your Supabase project dashboard
   - Navigate to Settings > API
   - Copy the Project URL and anon/public key

## After setting up the environment variables:

1. Restart your development server: `npm run dev`
2. The app should now work without the React context errors 