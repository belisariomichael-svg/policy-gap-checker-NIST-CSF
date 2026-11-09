# Setup Guide: Gemini (Google AI Studio) and Supabase

## A. Gemini API key (free)
1. Go to https://aistudio.google.com and sign in with a Google account.
2. Open **Get API key** and create a key. No payment details needed for the free tier.
3. Put it in `.env.local` as `GEMINI_API_KEY=...` (and later in Vercel).
4. Check which models your free tier allows and their limits: https://aistudio.google.com/rate-limit. Set `GEMINI_MODEL` to an allowed model (default `gemini-2.5-flash-lite`; a larger "flash" model may give better answers if your tier allows it).
5. Remember: **free-tier inputs may be used by Google to improve its products.** Test with public or sanitized policies only.

## B. Supabase project (free)
1. Sign up at https://supabase.com and click **New project** (choose a nearby region, save the database password).
2. Open **SQL Editor > New query**, paste the contents of `supabase/schema.sql`, click **Run**. This creates the `reports` table and its Row Level Security policies.
3. Open **Project Settings > API**. Copy the **Project URL** into `NEXT_PUBLIC_SUPABASE_URL` and the **anon / publishable key** into `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Never use the `service_role` key.
4. **Authentication > Providers > Email:** for your demo, turn off **Confirm email**. The built-in email sender allows only a few emails per hour, so confirmation emails would block testers. (To keep confirmation on, configure custom SMTP.)
5. After deploying to Vercel: **Authentication > URL Configuration**, set **Site URL** to your Vercel URL.

## C. Verify security (required, 5 minutes)
1. Create two test accounts (A and B) and save a report with each.
2. Signed in as A you must see only A's report. Signed in as B only B's.
3. In Supabase **Table Editor > reports**, confirm the policy text itself is not stored (only title, score, counts, result).
4. Take screenshots for your documentation.

## D. Free-tier gotchas
| Issue | What happens | What to do |
|---|---|---|
| Gemini rate limit | App shows "busy"; HTTP 503 | Wait a minute and retry; keep test policies short |
| Model not available on free tier | "Analysis failed" in app, error in terminal | Change `GEMINI_MODEL` to one your console lists |
| Supabase pause | Project paused after 1 week of inactivity; sign-in/save fail | Open the dashboard and click **Restore** (do this before your demo and before submission) |
| Auth email cap | Sign-up emails not arriving | Turn off Confirm email for the demo |
